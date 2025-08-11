import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { NegativeInventoryItemDto } from './dto/create-negative-inventory.dto';

@Injectable()
export class NegativeInventoryService {
    constructor(private readonly prisma: PrismaService) { }

    async createMany(storeId: string, items: NegativeInventoryItemDto[]) {
        // ตรวจสอบว่ามี store จริงหรือไม่
        const storeExists = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!storeExists) {
            throw new NotFoundException(`Store with ID ${storeId} not found`);
        }

        const pendingStatus = await this.getPendingStatusId();
        const results = [];

        for (const item of items) {
            let syncDate: Date;
            if (item.syncDate) {
                if (typeof item.syncDate === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(item.syncDate)) {
                    const [day, month, year] = item.syncDate.split('/').map(Number);
                    const gregorianYear = year > 2400 ? year - 543 : year;
                    const now = new Date();
                    syncDate = new Date(
                        gregorianYear,
                        month - 1,
                        day,
                        now.getHours(),
                        now.getMinutes(),
                        now.getSeconds(),
                        now.getMilliseconds()
                    );
                } else {
                    syncDate = new Date(item.syncDate);
                }
            } else {
                syncDate = new Date();
            }

            // ปรับ existQty ให้ไม่ต่ำกว่า 0
            const expectedQty = item.existQty < 0 ? 0 : item.existQty;
            const actualQty = item.updateQty ?? null;

            // คำนวณ difference ตามข้อ 3
            const difference = actualQty !== null ? actualQty - expectedQty : null;

            const record = await this.prisma.negativeInventoryHistory.upsert({
                where: {
                    storeId_productId_syncDate: {
                        storeId,
                        productId: item.productId,
                        syncDate
                    }
                },
                update: {
                    existQty: item.existQty,
                    updateQty: item.updateQty ?? null,
                    difference: difference,
                    note: item.note ?? null
                },
                create: {
                    storeId,
                    productId: item.productId,
                    syncDate,
                    existQty: item.existQty,
                    updateQty: item.updateQty ?? null,
                    difference: difference,
                    statusId: pendingStatus,
                    note: item.note ?? null
                }
            });

            results.push(record);
        }

        return { message: 'Negative inventories added/updated successfully', count: results.length, data: results };
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
