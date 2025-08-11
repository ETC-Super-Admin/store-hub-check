import { IsString, IsNumber, IsUUID, IsDateString, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class NegativeInventoryItemDto {
    @IsUUID()
    productId: string;

    @IsNumber()
    existQty: number;

    @IsOptional()
    @IsNumber()
    updateQty?: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsDateString()
    syncDate?: string; // สามารถส่งวันเองได้
}

export class CreateNegativeInventoryDto {
    @IsUUID()
    storeId: string;

    @ValidateNested({ each: true })
    @Type(() => NegativeInventoryItemDto)
    @ArrayMinSize(1)
    items: NegativeInventoryItemDto[];
}
