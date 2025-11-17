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
import { BrandService } from './brand.service';
import { CreateBrandDto, idDto, QueryDto, UpdateBrandDto } from './brand.dto';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import { Auth, User } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidation, multerCloud } from 'src/common/utilits/multer';
import type { HUserDocument } from 'src/DB';
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  //------- create brand -------
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
  async createBrand(
    @Body() branddto: CreateBrandDto,
    @User() user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const brand = await this.brandService.createBrand(branddto, user, file);
    return { message: 'Done', brand };
  }
  //------- update brand -------
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
  async updateBrand(
    @Param() params: idDto,
    @Body() branddto: UpdateBrandDto,
    @User() user: HUserDocument,
  ) {
    const brand = await this.brandService.updateBrand(
      params.id,
      branddto,
      user,
    );
    return { message: 'Done', brand };
  }
  //------- update brand image -------
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
  async updateBrandImage(
    @Param() params: idDto,
    @User() user: HUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ) {
    const brand = await this.brandService.updateBrandImage(
      params.id,
      file,
      user,
    );
    return { message: 'Done', brand };
  }
  //---------- freeze brand ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Patch('/freeze/:id')
  async freezeBrand(@Param() params: idDto, @User() user: HUserDocument) {
    const brand = await this.brandService.freezeBrand(params.id, user);
    return { message: 'Done', brand };
  }
  //---------- restore brand ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Patch('/restore/:id')
  async restoreBrand(@Param() params: idDto, @User() user: HUserDocument) {
    const brand = await this.brandService.restoreBrand(params.id, user);
    return { message: 'Done', brand };
  }
  //---------- delete brand ----------
  @Auth({
    role: [UserRole.ADMIN],
    tokenType: TokenTypeEnum.access,
  })
  @Delete('/delete/:id')
  async deleteBrand(@Param() params: idDto) {
    const brand = await this.brandService.deleteBrand(params.id);
    return { message: 'Done', brand };
  }
  //----------- get all brands -----------
  @Get()
  async getAllBrands(@Query() query: QueryDto) {
    const brands = await this.brandService.getAllBrands(query);
    return { message: 'Done', brands };
  }
}
