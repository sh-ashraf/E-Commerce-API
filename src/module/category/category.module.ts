import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { S3Service, TokenService } from 'src/common/services';
import { JwtService } from '@nestjs/jwt';
import {
  UserModel,
  UserRepository,
  BrandModel,
  CategoryModel,
  CategoryRepository,
  BrandRepository,
} from 'src/DB';
@Module({
  imports: [UserModel, BrandModel, CategoryModel],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    TokenService,
    JwtService,
    UserRepository,
    CategoryRepository,
    S3Service,
    BrandRepository,
  ],
})
export class CategoryModule {}
