import { Module } from '@nestjs/common';
import { NegativeInventoryController } from './negative-inventory.controller';
import { NegativeInventoryService } from './negative-inventory.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [NegativeInventoryController],
  providers: [NegativeInventoryService, PrismaService]
})
export class NegativeInventoryModule {}
