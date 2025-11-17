import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { S3Service, TokenService } from 'src/common/services';
import { JwtService } from '@nestjs/jwt';
import {
  UserModel,
  UserRepository,
  BrandModel,
  CategoryModel,
  CategoryRepository,
  BrandRepository,
  ProductModel,
  ProductRepository,
} from 'src/DB';
@Module({
  imports: [UserModel, BrandModel, CategoryModel, ProductModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    BrandRepository,
    CategoryRepository,
    UserRepository,
    S3Service,
    TokenService,
    JwtService,
  ],
})
export class ProductModule {}
