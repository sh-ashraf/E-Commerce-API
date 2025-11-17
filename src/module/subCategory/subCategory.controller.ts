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
  CreatesubCategoryDto,
  idDto,
  QueryDto,
  UpdatesubCategoryDto,
} from './subCategory.dto';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import { Auth, User } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidation, multerCloud } from 'src/common/utilits/multer';
import type { HUserDocument } from 'src/DB';
import { subCategoryService } from './subCategory.service';
@Controller('subCategories')
export class subCategoryController {
  constructor(private readonly subCategoryService: subCategoryService) {}
  //------- create subCategory -------
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
  async createsubCategory(
    @Body() subCategorydto: CreatesubCategoryDto,
    @User() user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const subCategory = await this.subCategoryService.createsubCategory(
      subCategorydto,
      user,
      file,
    );
    return { message: 'Done', subCategory };
  }
  //------- update subCategory -------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Patch('/update/:id')
  async updatesubCategory(
    @Param() params: idDto,
    @Body() subCategorydto: UpdatesubCategoryDto,
    @User() user: HUserDocument,
  ) {
    const subCategory = await this.subCategoryService.updatesubCategory(
      params.id,
      subCategorydto,
      user,
    );
    return { message: 'Done', subCategory };
  }
  //------- update subCategory image -------
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
  async updatesubCategoryImage(
    @Param() params: idDto,
    @User() user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const subCategory = await this.subCategoryService.updatesubCategoryImage(
      params.id,
      file,
      user,
    );
    return { message: 'Done', subCategory };
  }
  //---------- freeze subCategory ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Patch('/freeze/:id')
  async freezesubCategory(@Param() params: idDto, @User() user: HUserDocument) {
    const subCategory = await this.subCategoryService.freezesubCategory(
      params.id,
      user,
    );
    return { message: 'Done', subCategory };
  }
  //---------- restore subCategory ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Patch('/restore/:id')
  async restoresubCategory(
    @Param() params: idDto,
    @User() user: HUserDocument,
  ) {
    const subCategory = await this.subCategoryService.restoresubCategory(
      params.id,
      user,
    );
    return { message: 'Done', subCategory };
  }
  //---------- delete subCategory ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Delete('/delete/:id')
  async deletesubCategory(@Param() params: idDto) {
    const subCategory = await this.subCategoryService.deletesubCategory(
      params.id,
    );
    return { message: 'Done', subCategory };
  }
  //----------- get all subCategories -----------
  @Get()
  async getAllsubCategories(@Query() query: QueryDto) {
    const subCategories =
      await this.subCategoryService.getAllsubCategories(query);
    return { message: 'Done', subCategories };
  }
}
