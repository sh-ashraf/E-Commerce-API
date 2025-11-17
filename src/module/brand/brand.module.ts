import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { S3Service, TokenService } from 'src/common/services';
import { JwtService } from '@nestjs/jwt';
import { BrandRepository, UserModel, UserRepository, BrandModel } from 'src/DB';
@Module({
  imports: [UserModel, BrandModel],
  controllers: [BrandController],
  providers: [
    BrandService,
    TokenService,
    JwtService,
    UserRepository,
    BrandRepository,
    S3Service,
  ],
})
export class BrandModule {}
