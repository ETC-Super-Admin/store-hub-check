import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisType } from 'ioredis'; // Import default export and Redis type
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Injectable()
export class RedisService {
    private client: RedisType;

    constructor(private configService: ConfigService) { // Inject ConfigService
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST'), // Use environment variable or default to 'localhost'
            port: this.configService.get<number>('REDIS_PORT'), // Use environment variable or default to 6379
        });
        this.clearCache(); // Clear cache on server restart or reload
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, options?: { ttl: number }): Promise<void> {
        if (options?.ttl) {
            await this.client.set(key, value, 'EX', options.ttl);
        } else {
            await this.client.set(key, value);
        }
    }

    async clearCache(): Promise<void> {
        await this.client.flushdb(); // Clear all keys in the current database
    }
}
