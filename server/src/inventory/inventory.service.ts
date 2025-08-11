import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import fetch from 'node-fetch';
import { RedisService } from '../redis.service'; // Add RedisService import

@Injectable()
export class InventoryService {
    private readonly logger = new Logger(InventoryService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService // Inject RedisService
    ) { }

    private async fetchInventoryFromApi(storeId: string) {
        const apiUrl = `${process.env.API_URL}inventory/${storeId}`;
        const username = process.env.API_USERNAME;
        const password = process.env.API_PASSWORD;

        const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

        const response = await fetch(apiUrl, {
            headers: { Authorization: basicAuth },
        });

        if (response.status === 404) {
            this.logger.warn(`Store ${storeId} not found in API`);
            return null;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async syncAllInventories() {
        const stores = await this.prisma.store.findMany({ select: { id: true } });

        // Batch process stores for better performance
        const batchSize = 10;
        for (let i = 0; i < stores.length; i += batchSize) {
            const batch = stores.slice(i, i + batchSize);

            await Promise.all(batch.map(async (store) => {
                const cacheKey = `inventory:${store.id}`;
                let inventoryList: any[] | null = null;

                // Try to get inventory from Redis cache
                const cached = await this.redisService.get(cacheKey);
                if (cached) {
                    inventoryList = JSON.parse(cached);
                } else {
                    inventoryList = await this.fetchInventoryFromApi(store.id);
                    if (inventoryList) {
                        await this.redisService.set(cacheKey, JSON.stringify(inventoryList), { ttl: 300 }); // cache 5 min
                    }
                }

                if (!inventoryList) return;

                // Batch upsert inventory for this store
                const stockBatchSize = 20;
                for (let j = 0; j < inventoryList.length; j += stockBatchSize) {
                    const stockBatch = inventoryList.slice(j, j + stockBatchSize);
                    await Promise.all(stockBatch.map(stock => this.upsertInventory(store.id, stock)));
                }
            }));
        }

        return { message: 'Inventory sync completed' };
    }

    private async upsertInventory(storeId: string, stock: any) {
        await this.prisma.inventory.upsert({
            where: {
                storeId_productId: {
                    storeId,
                    productId: stock.productId,
                },
            },
            create: {
                storeId,
                productId: stock.productId,
                quantityOnHand: stock.quantityOnHand,
                warningStock: stock.warningStock ?? null,
                idealStock: stock.idealStock ?? null,
            },
            update: {
                quantityOnHand: stock.quantityOnHand,
                warningStock: stock.warningStock ?? null,
                idealStock: stock.idealStock ?? null,
            },
        });
    }

    async getInventoryByStoreId(storeId: string) {
        return this.prisma.inventory.findMany({
            where: { storeId },
        });
    }
}
