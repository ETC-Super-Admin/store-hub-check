import { Controller, Get, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('sync')
    async syncAll() {
        return this.inventoryService.syncAllInventories();
    }

    @Get(':storeId')
    async getInventoryByStoreId(@Param('storeId') storeId: string) {
        return this.inventoryService.getInventoryByStoreId(storeId);
    }
}
