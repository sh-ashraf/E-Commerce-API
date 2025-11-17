import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './module/auth/auth.module';
import { S3Service } from './common/services';
import { BrandModule } from './module/brand/brand.module';
import { CategoryModule } from './module/category/category.module';
import { subCategoryModule } from './module/subCategory/subCategory.module';
import { ProductModule } from './module/Product/product.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () =>
          console.log(`DB connected successfully on ${process.env.MONGO_URI}`),
        );
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    BrandModule,
    CategoryModule,
    subCategoryModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service],
})
export class AppModule {}
