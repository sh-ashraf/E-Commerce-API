import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { AtLeastOne, IdsMongo } from 'src/common/decorators';
export class CreatesubCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @IsNotEmpty()
  slogan: string;

  @Validate(IdsMongo)
  @IsOptional()
  brands: Types.ObjectId[];

  @IsMongoId()
  @IsNotEmpty()
  category: Types.ObjectId;
}
@AtLeastOne(['name', 'slogan'])
export class UpdatesubCategoryDto extends PartialType(CreatesubCategoryDto) {}

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
