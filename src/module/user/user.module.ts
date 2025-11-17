import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OtpModel, OtpRepository, UserModel, UserRepository } from 'src/DB';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Service, TokenService } from 'src/common/services';
@Module({
  imports: [
    UserModel,
    OtpModel,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    ConfigService,
    OtpRepository,
    TokenService,
    S3Service,
  ],
  exports: [],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
  //     .apply(tokenType(), AuthenticationMiddleware)
  //     .forRoutes('users/*demo');
  // }
}
