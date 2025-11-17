import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { signUpDTO } from './dto/signup.dto';
import { resendOtpDto } from './dto/verify_email.dto';
import { VerifyEmailDto } from './dto/verify_email.dto';
import { SignInDto } from './dto/login.dto';
// import { ForgotPasswordDto, ResetPasswordDto } from './dto/password';
// import { GoogleOAuthDto } from './dto/google-oauth.dto';
import { Auth, User } from 'src/common/decorators';
import type { HUserDocument } from 'src/DB/models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidation, multerCloud } from 'src/common/utilits/multer';
import { storageType } from 'src/common/enums/multer.enum';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  signUp(@Body() body: signUpDTO) {
    return this.userService.signUp(body);
  }
  @Post('resendOtp')
  resendOtp(@Body() body: resendOtpDto) {
    return this.userService.resendOtp(body);
  }

  @Patch('confirmEmail')
  confirmEmail(@Body() dto: VerifyEmailDto) {
    return this.userService.confirmEmail(dto);
  }
  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return this.userService.signIn(body);
  }
  @Auth()
  @Get('getProfile')
  getProfile(@User() user: HUserDocument) {
    return { message: 'Profile fetched successfully', user };
  }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({
        fileTypes: fileValidation.image,
        storeType: storageType.memory,
      }),
    ),
  )
  async uploadFile(
    @UploadedFiles() file: Express.Multer.File,
    @User() user: HUserDocument,
  ) {
    const url = await this.userService.uploadFile(file, user);
    return { message: 'file uploaded successfully', url };
  }

  // @Patch('forgotPassword')
  // async forgotPassword(@Body() dto: ForgotPasswordDto) {
  //   return this.userService.forgetPassword(dto);
  // }
  // @Patch('resetPassword')
  // async resetPassword(@Body() dto: ResetPasswordDto) {
  //   return this.userService.resetPassword(dto);
  // }

  // @Post('google-oauth')
  // async googleOAuth(@Body() dto: GoogleOAuthDto) {
  //   return this.userService.signInWithGoogle(dto);
  // }
}
