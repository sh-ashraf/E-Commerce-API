import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { AtLeastOne } from 'src/common/decorators';
export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100000)
  @IsNotEmpty()
  discription: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  discount: number;

  @IsMongoId()
  @IsNotEmpty()
  brand: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  stock: number;

  @IsMongoId()
  @IsNotEmpty()
  category: Types.ObjectId;

  // @IsMongoId()
  // @IsNotEmpty()
  // subCategory: Types.ObjectId;
}
@AtLeastOne(['name', 'slogan'])
export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class idDto {
  @IsNotEmpty()
  @IsMongoId()
  id: Types.ObjectId;
}
export class QueryDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
