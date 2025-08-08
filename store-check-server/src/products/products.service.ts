import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import fetch from 'node-fetch';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

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

    async getProductsFromApi() {
        return this.fetchFromApi('products');
    }

    async getProductByIdFromApi(id: string) {
        return this.fetchFromApi(`products/${id}`);
    }

    async syncProducts(id?: string) {
        if (id) {
            // Sync single product
            const product = await this.getProductByIdFromApi(id);
            await this.upsertProduct(product);
            return;
        }

        // Sync all products
        const products = await this.getProductsFromApi();
        const parents = products.filter(p => p.isParentProduct);
        const children = products.filter(p => !p.isParentProduct);

        for (const p of parents) {
            await this.upsertProduct(p, true);
        }
        for (const p of children) {
            await this.upsertProduct(p, false);
        }
    }

    private async upsertProduct(p: any, isParent?: boolean) {
        await this.prisma.product.upsert({
            where: { id: p.id },
            create: {
                id: p.id,
                name: p.name,
                sku: p.sku,
                barcode: p.barcode,
                category: p.category,
                subCategory: null,
                tags: [],
                priceType: p.priceType,
                unitPrice: p.unitPrice,
                cost: p.cost,
                trackStockLevel: p.trackStockLevel,
                isParentProduct: p.isParentProduct,
                parentProductId: p.isParentProduct ? null : p.parentProductId
            },
            update: {
                name: p.name,
                sku: p.sku,
                barcode: p.barcode,
                category: p.category,
                priceType: p.priceType,
                unitPrice: p.unitPrice,
                cost: p.cost,
                trackStockLevel: p.trackStockLevel,
                isParentProduct: p.isParentProduct,
                parentProductId: p.isParentProduct ? null : p.parentProductId
            }
        });

        // ถ้าเป็นสินค้าหลัก → เก็บ VariantGroup + VariantOption
        if (p.isParentProduct && p.variantGroups) {
            for (const vg of p.variantGroups) {
                await this.prisma.variantGroup.upsert({
                    where: { id: vg.id },
                    create: {
                        id: vg.id,
                        name: vg.name,
                        productId: p.id
                    },
                    update: { name: vg.name, productId: p.id }
                });

                if (vg.options) {
                    for (const opt of vg.options) {
                        await this.prisma.variantOption.upsert({
                            where: { id: opt.id },
                            create: {
                                id: opt.id,
                                optionValue: opt.optionValue,
                                isDefault: opt.isDefault,
                                priceDifference: opt.priceDifference,
                                variantGroupId: vg.id
                            },
                            update: {
                                optionValue: opt.optionValue,
                                isDefault: opt.isDefault,
                                priceDifference: opt.priceDifference,
                                variantGroupId: vg.id
                            }
                        });
                    }
                }
            }
        }

        // ถ้าเป็นสินค้าย่อย → เก็บ VariantValue
        if (!p.isParentProduct && p.variationValues) {
            for (const vv of p.variationValues) {
                await this.prisma.variantValue.upsert({
                    where: {
                        // Composite unique key ต้องสร้างใน Prisma schema ก่อน
                        productId_variantGroupId: {
                            productId: p.id,
                            variantGroupId: vv.variantGroupId
                        }
                    },
                    create: {
                        productId: p.id,
                        variantGroupId: vv.variantGroupId,
                        value: vv.value
                    },
                    update: {
                        value: vv.value
                    }
                });
            }
        }
    }

}
