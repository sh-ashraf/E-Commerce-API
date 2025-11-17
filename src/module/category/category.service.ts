import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, QueryDto, UpdateCategoryDto } from './category.dto';
import { BrandRepository, CategoryRepository } from 'src/DB';
import type { HUserDocument } from 'src/DB';
import { S3Service } from 'src/common/services/s3.service';
import { Types } from 'mongoose';
import { randomUUID } from 'crypto';
@Injectable()
export class CategoryService {
  constructor(
    private readonly CategoryRepository: CategoryRepository,
    private readonly s3Service: S3Service,
    private readonly BrandRepository: BrandRepository,
  ) {}
  //=================== Create Category ===================
  async createCategory(
    Categorydto: CreateCategoryDto,
    user: HUserDocument,
    file: Express.Multer.File,
  ) {
    const { name, slogan, brands } = Categorydto;
    const CategoryExists = await this.CategoryRepository.findOne({ name });
    if (CategoryExists) {
      throw new ConflictException('Category with this name already exists');
    }
    const strictId = [...new Set(brands || [])];
    if (
      brands &&
      (
        await this.BrandRepository.find({
          filter: { _id: { $in: strictId } },
        })
      ).length !== strictId.length
    ) {
      throw new NotFoundException('One or more brands not found');
    }
    const assetFolderId = randomUUID();
    const url = await this.s3Service.uploadFile({
      path: `Categories/${assetFolderId}`,
      file,
    });
    const Category = await this.CategoryRepository.create({
      name,
      slogan,
      image: url,
      createdBy: user._id,
      assetFolderId,
      brands: strictId,
    });
    if (!Category) {
      await this.s3Service.deleteFile({
        Key: url,
      });
      throw new ConflictException('Error creating Category');
    }
    return Category;
  }
  //=================== Update Category ===================
  async updateCategory(
    id: Types.ObjectId,
    Categorydto: UpdateCategoryDto,
    user: HUserDocument,
  ) {
    const { name, slogan, brands } = Categorydto;
    const Category = await this.CategoryRepository.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!Category) {
      throw new NotFoundException('Category not found');
    }
    if (
      name &&
      (await this.CategoryRepository.findOne({ name, createdBy: user._id }))
    ) {
      throw new ConflictException('Category with this name already exists');
    }
    const strictId = [...new Set(brands || [])];
    if (
      brands &&
      (
        await this.BrandRepository.find({
          filter: { _id: { $in: strictId } },
        })
      ).length !== strictId.length
    ) {
      throw new NotFoundException('One or more brands not found');
    }

    const updatedCategory = await this.CategoryRepository.findOneAndUpdate({
      filter: { _id: id, createdBy: user._id },
      update: { name, slogan, brands: strictId },
    });
    return updatedCategory;
  }
  //=================== Update Category Image ===================
  async updateCategoryImage(
    id: Types.ObjectId,
    file: Express.Multer.File,
    user: HUserDocument,
  ) {
    const Category = await this.CategoryRepository.findOne({
      _id: id,
      createdBy: user._id,
    });
    if (!Category) {
      throw new NotFoundException('Category not found');
    }
    const url = await this.s3Service.uploadFile({
      path: `Categories/${Category.assetFolderId}`,
      file,
    });
    const updatedCategory = await this.CategoryRepository.findOneAndUpdate({
      filter: { _id: id },
      update: { image: url },
    });
    if (!updatedCategory) {
      await this.s3Service.deleteFile({
        Key: url,
      });
      throw new ConflictException('Error updating Category image');
    }
    await this.s3Service.deleteFile({
      Key: Category.image,
    });
    return updatedCategory;
  }
  //=================== Freeze Category ===================
  async freezeCategory(id: Types.ObjectId, user: HUserDocument) {
    const Category = await this.CategoryRepository.findOneAndUpdate({
      filter: { _id: id, deletedAt: { $exists: false } },
      update: { deletedAt: new Date(), updatedBy: user._id },
    });
    if (!Category) {
      throw new NotFoundException('Category not found or already frozen');
    }
    return Category;
  }
  //=================== restore Category ===================
  async restoreCategory(id: Types.ObjectId, user: HUserDocument) {
    const Category = await this.CategoryRepository.findOneAndUpdate({
      filter: { _id: id, deletedAt: { $exists: true }, paranoid: false },
      update: {
        $unset: { deletedAt: '' },
        restoredAt: new Date(),
        updatedBy: user._id,
      },
    });
    if (!Category) {
      throw new NotFoundException('Category not found or already restored');
    }
    return Category;
  }
  //=================== Delete Category ===================
  async deleteCategory(id: Types.ObjectId) {
    const Category = await this.CategoryRepository.findOneAndDelete({
      filter: { _id: id, paranoid: false, deletedAt: { $exists: true } },
    });
    if (!Category) {
      throw new NotFoundException('Category not found or already deleted');
    }
    await this.s3Service.deleteFile({
      Key: Category.image,
    });
    return Category;
  }
  //=================== Get All Categories ===================
  async getAllCategories(query: QueryDto) {
    const { page = 1, limit = 2, search } = query;
    const { currentPage, countDocument, numberOfPages, docs } =
      await this.CategoryRepository.paginate({
        filter: {
          ...(search
            ? {
                $or: [
                  { name: { $regex: search, $options: 'i' } },
                  { slogan: { $regex: search, $options: 'i' } },
                ],
              }
            : {}),
        },
        query: { page, limit },
      });
    return { message: 'Done', currentPage, countDocument, numberOfPages, docs };
  }
}
