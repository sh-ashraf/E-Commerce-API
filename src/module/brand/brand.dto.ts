import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { AtLeastOne } from 'src/common/decorators/brand.custom.decorator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
export class CreateBrandDto {
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
}
@AtLeastOne(['name', 'slogan'])
export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

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
