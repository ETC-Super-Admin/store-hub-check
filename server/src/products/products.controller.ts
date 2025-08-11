import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('sync')
    async syncAllProducts() {
        try {
            await this.productsService.syncProducts();
            return { message: 'All products synced successfully' };
        } catch (error) {
            return {
                message: 'Failed to sync products',
                error: error.message
            };
        }
    }

    @Get('sync/:id')
    async syncProductById(@Param('id') id: string) {
        try {
            await this.productsService.syncProducts(id);
            return { message: `Product ${id} synced successfully` };
        } catch (error) {
            return {
                message: 'Failed to sync product',
                error: error.message
            };
        }
    }

    @Get()
    async getAllProducts() {
        return await this.productsService.getProductsFromApi();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return this.productsService.getProductByIdFromApi(id);
    }
}
