import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from '../redis.service';

@Injectable()
export class HistoryService {
    private readonly logger = new Logger(HistoryService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService
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

    async detectNegativeInventories() {
        const stores = await this.prisma.store.findMany({ select: { id: true } });
        const pendingStatusId = await this.getPendingStatusId();
        let createdCount = 0;

        for (const store of stores) {
            const cacheKey = `inventory:${store.id}`;
            let inventoryList: any[] | null = null;

            // 1. Try from Redis
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                inventoryList = JSON.parse(cached);
            } else {
                // 2. Fetch from API & cache
                inventoryList = await this.fetchInventoryFromApi(store.id);
                if (inventoryList) {
                    await this.redisService.set(cacheKey, JSON.stringify(inventoryList), { ttl: 300 });
                }
            }

            if (!inventoryList) continue;

            // 3. Filter negative quantities
            const negatives = inventoryList.filter((item: any) => item.quantityOnHand < 0);

            for (const neg of negatives) {
                // หา productId จาก sku
                const product = await this.prisma.product.findFirst({
                    where: { sku: neg.sku },
                    select: { id: true }
                });

                if (!product) continue; // ถ้าไม่เจอ product ข้าม

                // Upsert เพื่อเลี่ยง unique constraint error
                await this.prisma.negativeInventoryHistory.upsert({
                    where: {
                        storeId_productId_syncDate: {
                            storeId: store.id,
                            productId: product.id,
                            syncDate: new Date(new Date().toDateString()) // normalize date
                        }
                    },
                    update: {
                        existQty: neg.quantityOnHand,
                        updateQty: null,
                        difference: null,
                        statusId: pendingStatusId,
                        note: null
                    },
                    create: {
                        storeId: store.id,
                        productId: product.id,
                        syncDate: new Date(),
                        existQty: neg.quantityOnHand,
                        statusId: pendingStatusId,
                        note: null
                    }
                });

                createdCount++;
            }
        }

        return {
            message: 'Negative inventory detection completed',
            found: createdCount
        };
    }

    private async getPendingStatusId(): Promise<string> {
        const status = await this.prisma.status.findUnique({
            where: { name: 'PENDING' }
        });

        if (!status) {
            const created = await this.prisma.status.create({
                data: { name: 'PENDING' }
            });
            return created.id;
        }

        return status.id;
    }
}
