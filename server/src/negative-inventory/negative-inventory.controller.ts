import { Body, Controller, Post, Param } from '@nestjs/common';
import { NegativeInventoryService } from './negative-inventory.service';
import { CreateNegativeInventoryDto, NegativeInventoryItemDto } from './dto/create-negative-inventory.dto';

@Controller('negative-inventory')
export class NegativeInventoryController {
    constructor(private readonly service: NegativeInventoryService) { }

    @Post(':storeId')
    async createMany(
        @Param('storeId') storeId: string,
        @Body() body: { items: NegativeInventoryItemDto[] }
    ) {
        return this.service.createMany(storeId, body.items);
    }
}
