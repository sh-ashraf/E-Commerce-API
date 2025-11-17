import {
  Body,
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import { Auth, User } from 'src/common/decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileValidation, multerCloud } from 'src/common/utilits/multer';
import type { HUserDocument } from 'src/DB';
import { CreateProductDto } from './product.dto';
@Controller('Products')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}
  //------- create Product -------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
      ],
      multerCloud({ fileTypes: fileValidation.image }),
    ),
  )
  @Post()
  async createProduct(
    @Body() productDto: CreateProductDto,
    @User() user: HUserDocument,
    @UploadedFile(ParseFilePipe)
    files: {
      mainImage: Express.Multer.File[];
      subImages: Express.Multer.File[];
    },
  ) {
    const product = await this.ProductService.createProduct(
      productDto,
      user,
      files,
    );
    return { message: 'Done', product };
  }
}
