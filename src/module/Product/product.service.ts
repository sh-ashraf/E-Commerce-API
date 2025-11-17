import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './product.dto';
import { ProductRepository, BrandRepository, CategoryRepository } from 'src/DB';
import type { HUserDocument } from 'src/DB';
import { S3Service } from 'src/common/services/s3.service';
@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly s3Service: S3Service,
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}
  //=================== Create Product ===================
  async createProduct(
    productDto: CreateProductDto,
    user: HUserDocument,
    file: {
      mainImage: Express.Multer.File[];
      subImages: Express.Multer.File[];
    },
  ) {
    const { name, discription, discount, quantity, stock, brand, category } =
      productDto;
    let { price } = productDto;
    const brandExists = await this.brandRepository.findOne({ _id: brand });
    if (!brandExists) {
      throw new NotFoundException('brand not found');
    }
    const categoryExists = await this.categoryRepository.findOne({
      _id: category,
    });
    if (!categoryExists) {
      throw new NotFoundException('category not found');
    }
    if (stock > quantity) {
      throw new BadRequestException('stock cannot be greater than quantity');
    }
    price = price - price * ((discount || 0) / 100);
    const filePath = file.mainImage[0];
    const filesPath = file.subImages;
    const mainImageUrl = await this.s3Service.uploadFile({
      file: filePath,
      path: `Categories/${categoryExists.assetFolderId}/Products/mainImage`,
    });
    const subImagesUrls = await this.s3Service.uploadFiles({
      files: filesPath,
      path: `Categories/${categoryExists.assetFolderId}/Products/subImages`,
    });
    const product = await this.productRepository.create({
      name,
      discription,
      price,
      discount,
      quantity,
      stock,
      brand,
      category,
      mainImage: mainImageUrl,
      subImage: subImagesUrls,
    });
    if (!product) {
      await this.s3Service.deleteFile({ Key: mainImageUrl });
      await this.s3Service.deleteFiles({ urls: subImagesUrls });
      throw new BadRequestException('Error creating product');
    }
    return product;
  }
}
