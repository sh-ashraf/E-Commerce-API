import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Compare } from 'src/common/utilits/hash';
import { VerifyEmailDto } from './dto/verify_email.dto';
// import { SignInDto } from './dto/login.dto';
// import { ForgotPasswordDto, ResetPasswordDto } from './dto/password';
// import { GoogleAuthDto } from './dto/google-oauth.dto';
// import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { signUpDTO } from './dto/signup.dto';
// import { v4 as uuidv4 } from 'uuid';
// import { UserProvider } from 'src/common/enums';
import { eventEmitter } from 'src/common/utilits/email.event';
import { generateOtp } from 'src/common/services/email/email.service';
import { HUserDocument, OtpRepository, UserRepository } from 'src/DB';
import { OtpEnumType, UserGender, UserRole } from 'src/common/enums';
import { resendOtpDto } from './dto/verify_email.dto';
import { Types } from 'mongoose';
import { SignInDto } from './dto/login.dto';
import { S3Service, TokenService } from 'src/common/services';
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private otpRepository: OtpRepository,
    private readonly s3Service: S3Service,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}
  private async sendOtp(userId: Types.ObjectId) {
    const otp = generateOtp();
    await this.otpRepository.create({
      code: otp.toString(),
      createdBy: userId,
      type: OtpEnumType.CONFIRM_EMAIL,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
    });
  }
  //==================== Sign Up ====================
  async signUp(body: signUpDTO) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, age, firstName, lastName, userName, gender } = body;
    const existingUser = await this.userRepository.findOne({
      email: body.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.userRepository.create({
      email,
      firstName,
      lastName,
      userName,
      age,
      password: body.password, // Remove manual hashing - pre-save middleware handles this
      confirmed: false,
      gender: body.gender ?? UserGender.MALE,
    });
    if (!user) {
      throw new BadRequestException('Failed to create user');
    }
    const otp = generateOtp().toString();
    eventEmitter.emit('confirmEmail', { email: body.email, otp });
    await this.sendOtp(user._id);
    return {
      message: 'User created successfully',
      user,
    };
  }
  //==================== Resend OTP ====================
  async resendOtp(body: resendOtpDto) {
    const { email } = body;
    const user = await this.userRepository.findOne(
      { email, confirmed: false },
      undefined,
      {
        populate: {
          path: 'otp',
        },
      },
    );
    if (!user) {
      throw new BadRequestException('User not found or already confirmed');
    }
    if (user.otp) {
      throw new BadRequestException('OTP already sent');
    }

    await this.sendOtp(user._id);
    return {
      message: 'OTP resent successfully',
    };
  }
  //==================== confirm Email ===============
  async confirmEmail(body: VerifyEmailDto) {
    const { email, code } = body;
    const user = await this.userRepository.findOne(
      {
        email,
        confirmed: false,
      },
      undefined,
      {
        populate: {
          path: 'otp',
        },
      },
    );
    if (!user) {
      throw new BadRequestException('User not found or already confirmed');
    }
    console.log('Code from user:', code);
    console.log('OTP from DB:', user.otp);

    if (!user.otp || !(await Compare(code, user.otp.code))) {
      throw new BadRequestException('Invalid OTP');
    }

    user.confirmed = true;
    await user.save();
    await this.otpRepository.deleteOne({
      createdBy: user._id,
    });
    return {
      message: 'Email confirmed successfully',
    };
  }
  //==================== sign In ====================
  async signIn(body: SignInDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password } = body;
    const user = await this.userRepository.findOne({
      email: body.email,
      confirmed: true,
    });
    if (!user) {
      throw new BadRequestException('Invalid email or unconfirmed account');
    }
    if (!(await Compare(body.password, user.password))) {
      throw new BadRequestException('Invalid password');
    }
    const access_token = await this.tokenService.GenerateToken({
      payload: { email, id: user._id },
      options: {
        secret:
          user.role == UserRole.USER
            ? process.env.ACCESS_TOKEN_USER!
            : process.env.ACCESS_TOKEN_ADMIN!,
        expiresIn: '1d',
      },
    });
    const refresh_token = await this.tokenService.GenerateToken({
      payload: { email, id: user._id },
      options: {
        secret:
          user.role == UserRole.USER
            ? process.env.REFRESH_TOKEN_USER!
            : process.env.REFRESH_TOKEN_ADMIN!,
        expiresIn: '1y',
      },
    });

    return {
      message: 'User logged in successfully',
      access_token,
      refresh_token,
    };
  }
  //==================== upload file ====================
  uploadFile(file: Express.Multer.File, user: HUserDocument) {
    return this.s3Service.uploadFile({
      file,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      path: `users/${user._id}`,
    });
  }
  //==================== forget Password ====================
  // async forgetPassword({ email }: ForgotPasswordDto) {
  //   const user = await this.userRepository.findOne({ email });
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  //   const otp = this.emailService.generateOtp().toString();
  //   const otpHash = await BcryptUtil.hashPassword(otp);
  //   await this.emailService.sendEmail({
  //     to: email,
  //     subject: 'Reset Your Password',
  //     html: emailTemplate(otp, 'Forget Password'),
  //   });
  //   await this.userRepository.updateOne(
  //     { email },
  //     { otp: otpHash, otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
  //   );
  //   return { message: 'OTP sent successfully to your email' };
  // }
  //===================== reset Password =====================
  // async resetPassword({ email, otp, password }: ResetPasswordDto) {
  //   const user = await this.userRepository.findOne({
  //     email,
  //     otp: { $exists: true },
  //   });
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  //   if (!user.otp || !(await BcryptUtil.comparePassword(otp, user.otp))) {
  //     throw new BadRequestException('Invalid OTP');
  //   }
  //   const hashedPassword = await BcryptUtil.hashPassword(password);
  //   await this.userRepository.updateOne(
  //     { email: email },
  //     {
  //       $set: { password: hashedPassword },
  //       $unset: { otp: '', otpExpires: '' },
  //     },
  //   );

  //   return { message: 'Password reset successfully' };
  // }

  //==================== Google OAuth Sign In/Up ====================
  // async signInWithGoogle(dto: GoogleOAuthDto) {
  //   const client = new OAuth2Client();

  //   const ticket = await client.verifyIdToken({
  //     idToken: dto.idToken,
  //     audience: this.configService.get('WEB_CLIENT_ID'),
  //   });
  //   const googlePayload = ticket.getPayload();

  //   const { email, email_verified, picture, name } =
  //     googlePayload as TokenPayload;

  //   // Check if user exists
  //   let user = await this.userRepository.findOne({ email: email! });

  //   if (!user) {
  //     // Create new user for Google OAuth
  //     user = await this.userRepository.create({
  //       email: email!,
  //       image: picture!,
  //       confirmed: email_verified!,
  //       userName: name!,
  //       password: await BcryptUtil.hashPassword(uuidv4()), // Random password for OAuth users
  //       provider: UserProvider.GOOGLE,
  //     });
  //   }

  //   // Check if user is trying to login with Google but registered with system
  //   if (user.provider === UserProvider.LOCAL) {
  //     throw new BadRequestException(
  //       'This email is registered with a password. Please sign in with your password instead.',
  //     );
  //   }

  //   const jwtPayload = {
  //     sub: user._id,
  //     email: user.email,
  //     role: user.role,
  //   };

  //   const jwtid = uuidv4();
  //   const accessToken = this.jwtService.sign(
  //     { ...jwtPayload, jti: jwtid },
  //     { expiresIn: '1d' },
  //   );
  //   const refreshToken = this.jwtService.sign(
  //     { ...jwtPayload, jti: jwtid },
  //     { expiresIn: '7d' },
  //   );

  //   return {
  //     message: 'User logged in with Google successfully',
  //     accessToken,
  //     refreshToken,
  //     user: {
  //       id: user._id,
  //       email: user.email,
  //       firstName: user.firstName || '',
  //       lastName: user.lastName || '',
  //       userName: user.userName || '',
  //       role: user.role,
  //       image: user.image || '',
  //       provider: user.provider,
  //     },
  //   };
}
