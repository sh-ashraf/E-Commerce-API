import { Module } from '@nestjs/common';
import { subCategoryController } from './subCategory.controller';
import { subCategoryService } from './subCategory.service';
import { S3Service, TokenService } from 'src/common/services';
import { JwtService } from '@nestjs/jwt';
import {
  UserModel,
  UserRepository,
  BrandModel,
  subCategoryModel,
  subCategoryRepository,
  BrandRepository,
} from 'src/DB';
@Module({
  imports: [UserModel, BrandModel, subCategoryModel],
  controllers: [subCategoryController],
  providers: [
    subCategoryService,
    TokenService,
    JwtService,
    UserRepository,
    subCategoryRepository,
    S3Service,
    BrandRepository,
  ],
})
export class subCategoryModule {}
