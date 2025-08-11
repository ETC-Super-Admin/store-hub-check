import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { PrismaModule } from '../prisma.module';
import { RedisModule } from '../redis.module';

@Module({
  imports: [RedisModule],
  controllers: [InventoryController],
  providers: [InventoryService, PrismaModule],
})
export class InventoryModule {}
