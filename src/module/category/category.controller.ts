import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  idDto,
  QueryDto,
  UpdateCategoryDto,
} from './category.dto';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import { Auth, User } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidation, multerCloud } from 'src/common/utilits/multer';
import type { HUserDocument } from 'src/DB';
import { CategoryService } from './category.service';
@Controller('Categories')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}
  //------- create Category -------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({ fileTypes: fileValidation.image }),
    ),
  )
  @Post()
  async createCategory(
    @Body() Categorydto: CreateCategoryDto,
    @User() user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const Category = await this.CategoryService.createCategory(
      Categorydto,
      user,
      file,
    );
    return { message: 'Done', Category };
  }
  //------- update Category -------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({ fileTypes: fileValidation.image }),
    ),
  )
  @Patch('/update/:id')
  async updateCategory(
    @Param() params: idDto,
    @Body() Categorydto: UpdateCategoryDto,
    @User() user: HUserDocument,
  ) {
    const Category = await this.CategoryService.updateCategory(
      params.id,
      Categorydto,
      user,
    );
    return { message: 'Done', Category };
  }
  //------- update Category image -------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({ fileTypes: fileValidation.image }),
    ),
  )
  @Patch('/updateImage/:id')
  async updateCategoryImage(
    @Param() params: idDto,
    @User() user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const Category = await this.CategoryService.updateCategoryImage(
      params.id,
      file,
      user,
    );
    return { message: 'Done', Category };
  }
  //---------- freeze Category ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Patch('/freeze/:id')
  async freezeCategory(@Param() params: idDto, @User() user: HUserDocument) {
    const Category = await this.CategoryService.freezeCategory(params.id, user);
    return { message: 'Done', Category };
  }
  //---------- restore Category ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Patch('/restore/:id')
  async restoreCategory(@Param() params: idDto, @User() user: HUserDocument) {
    const Category = await this.CategoryService.restoreCategory(
      params.id,
      user,
    );
    return { message: 'Done', Category };
  }
  //---------- delete Category ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Delete('/delete/:id')
  async deleteCategory(@Param() params: idDto) {
    const Category = await this.CategoryService.deleteCategory(params.id);
    return { message: 'Done', Category };
  }
  //----------- get all Categories -----------
  @Get()
  async getAllCategories(@Query() query: QueryDto) {
    const Categories = await this.CategoryService.getAllCategories(query);
    return { message: 'Done', Categories };
  }
}
