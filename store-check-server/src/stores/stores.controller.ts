import { Controller, Get } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) {}

    @Get('sync')
    async syncAllStores() {
        await this.storesService.syncStores();
        return { message: 'All stores synced' };
    }

    @Get()
    async getStores() {
        return this.storesService.getStoresFromApi();
    }
}
