import { Controller, Get } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    // เรียกเพื่อให้ detect negative inventory ทุก store
    @Get('detect')
    async detectNegatives() {
        return this.historyService.detectNegativeInventories();
    }
}
