import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import fetch from 'node-fetch';

@Injectable()
export class StoresService {
    constructor(private readonly prisma: PrismaService) {}

    private async fetchFromApi(endpoint: string) {
        const apiUrl = process.env.API_URL + endpoint;
        const username = process.env.API_USERNAME;
        const password = process.env.API_PASSWORD;

        const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

        const response = await fetch(apiUrl, {
            headers: { Authorization: basicAuth },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async getStoresFromApi() {
        return this.fetchFromApi('stores');
    }

    async syncStores(id?: string) {
        // Sync all stores
        const stores = await this.getStoresFromApi();
        for (const s of stores) {
            await this.upsertStore(s);
        }
    }

    private async upsertStore(s: any) {
        await this.prisma.store.upsert({
            where: { id: s.id },
            create: {
                id: s.id,
                name: s.name,
                address1: s.address1,
                address2: s.address2,
                city: s.city,
                state: s.state,
                country: s.country,
                postalCode: s.postalCode,
                phone: s.phone,
                email: s.email,
                website: s.website
            },
            update: {
                name: s.name,
                address1: s.address1,
                address2: s.address2,
                city: s.city,
                state: s.state,
                country: s.country,
                postalCode: s.postalCode,
                phone: s.phone,
                email: s.email,
                website: s.website
            }
        });
    }

    async getStoresFromDb() {
        return this.prisma.store.findMany();
    }
}