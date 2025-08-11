import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { PrismaService } from 'src/prisma.service';
import { RedisModule } from 'src/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [HistoryController],
  providers: [HistoryService, PrismaService]
})
export class HistoryModule {}
