import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { storageType } from '../enums';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { Upload } from '@aws-sdk/lib-storage';
@Injectable()
export class S3Service {
  private readonly S3Client: S3Client;
  private readonly isConfigured: boolean;

  constructor() {
    // Check if AWS configuration is provided
    this.isConfigured = !!(
      process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_BUCKET_NAME
    );

    if (this.isConfigured) {
      this.S3Client = new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
    } else {
      console.warn(
        'AWS S3 configuration is incomplete. S3Service methods will throw errors when called.',
      );
      // Create a dummy client to prevent instantiation errors
      this.S3Client = {} as S3Client;
    }
  }

  private checkConfiguration(): void {
    if (!this.isConfigured) {
      throw new BadRequestException(
        'AWS S3 is not configured. Please set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_BUCKET_NAME environment variables.',
      );
    }
  }

  uploadFile = async ({
    storeType = storageType.memory,
    Bucket = process.env.AWS_BUCKET_NAME!,
    ACL = 'private' as ObjectCannedACL,
    path = 'general',
    file,
  }: {
    storeType?: storageType;
    Bucket?: string;
    ACL?: ObjectCannedACL;
    path: string;
    file: Express.Multer.File;
  }): Promise<string> => {
    this.checkConfiguration();
    const command = new PutObjectCommand({
      Bucket,
      Key: `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${file.originalname}`,
      ACL,
      Body:
        storeType === storageType.memory
          ? file.buffer
          : createReadStream(file.path),
      ContentType: file.mimetype,
    });
    await this.S3Client.send(command);
    if (!command.input.Key) {
      throw new BadRequestException('File upload failed');
    }
    return command.input.Key;
  };

  uploadLargeFile = async ({
    storeType = storageType.memory,
    Bucket = process.env.AWS_BUCKET_NAME!,
    ACL = 'private' as ObjectCannedACL,
    path = 'general',
    file,
  }: {
    storeType?: storageType;
    Bucket?: string;
    ACL?: ObjectCannedACL;
    path: string;
    file: Express.Multer.File;
  }): Promise<string> => {
    this.checkConfiguration();
    const upload = new Upload({
      client: this.S3Client,
      params: {
        Bucket,
        Key: `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${file.originalname}`,
        ACL,
        Body:
          storeType === storageType.memory
            ? file.buffer
            : createReadStream(file.path),
        ContentType: file.mimetype,
      },
    });

    upload.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });

    const { Key } = await upload.done();
    if (!Key) {
      throw new BadRequestException('File upload failed');
    }
    return Key;
  };
  uploadFiles = async ({
    storeType = storageType.memory,
    Bucket = process.env.AWS_BUCKET_NAME!,
    ACL = 'private' as ObjectCannedACL,
    path = 'general',
    files,
    useLargeFiles = false,
  }: {
    storeType?: storageType;
    Bucket?: string;
    ACL?: ObjectCannedACL;
    path: string;
    files: Express.Multer.File[];
    useLargeFiles?: boolean;
  }) => {
    let urls: string[] = [];
    if (useLargeFiles === true) {
      urls = await Promise.all(
        files.map((file) =>
          this.uploadLargeFile({ storeType, Bucket, ACL, path, file }),
        ),
      );
    } else {
      urls = await Promise.all(
        files.map((file) =>
          this.uploadFile({ storeType, Bucket, ACL, path, file }),
        ),
      );
    }
    return urls;
  };

  createUploadFilePreSignedUrl = async ({
    Bucket = process.env.AWS_BUCKET_NAME!,
    path = 'general',
    originalname,
    ContentType,
    expiresIn = 60 * 60,
  }: {
    Bucket?: string;
    path?: string;
    originalname: string;
    ContentType: string;
    expiresIn?: number;
  }) => {
    const command = new PutObjectCommand({
      Bucket,
      Key: `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${originalname}`,
      ContentType,
    });
    const url = await getSignedUrl(this.S3Client, command, { expiresIn });
    return { url, Key: command.input.Key! };
  };
  // get file
  getFile = async ({
    Bucket = process.env.AWS_BUCKET_NAME!,
    path,
  }: {
    Bucket?: string;
    path: string;
  }) => {
    const command = new GetObjectCommand({
      Bucket,
      Key: path,
    });
    return await this.S3Client.send(command);
  };
  // create pre-signed url to get file
  createGetFilePreSignedUrl = async ({
    Bucket = process.env.AWS_BUCKET_NAME!,
    path,
    expiresIn = 60 * 60,
    downLoadName,
  }: {
    Bucket?: string;
    path: string;
    expiresIn?: number;
    downLoadName?: string | undefined;
  }) => {
    const command = new GetObjectCommand({
      Bucket,
      Key: path,
      ResponseContentDisposition: downLoadName
        ? `attachment; filename="${downLoadName}"`
        : undefined,
    });
    const url = await getSignedUrl(this.S3Client, command, { expiresIn });
    return url;
  };
  // delete file
  deleteFile = async ({
    Bucket = process.env.AWS_BUCKET_NAME!,
    Key,
  }: {
    Bucket?: string;
    Key: string;
  }) => {
    const command = new DeleteObjectCommand({
      Bucket,
      Key,
    });
    return await this.S3Client.send(command);
  };
  // delete files
  deleteFiles = async ({
    Bucket = process.env.AWS_BUCKET_NAME!,
    urls,
    Quiet = false,
  }: {
    Bucket?: string;
    urls: string[];
    Quiet?: boolean;
  }) => {
    const command = new DeleteObjectsCommand({
      Bucket,
      Delete: {
        Objects: urls.map((urls) => ({ Key: urls })),
        Quiet,
      },
    });
    return await this.S3Client.send(command);
  };
  // list files
  listFiles = async ({
    Bucket = process.env.AWS_BUCKET_NAME!,
    path,
  }: {
    Bucket?: string;
    path: string;
  }) => {
    const command = new ListObjectsV2Command({
      Bucket,
      Prefix: `${process.env.APPLICATION_NAME}/${path}`,
    });
    return await this.S3Client.send(command);
  };
  // delete folder by prefix
  deleteFolderByPrefix = async ({
    Bucket = process.env.AWS_BUCKET_NAME!,
    path,
  }: {
    Bucket?: string;
    path: string;
  }) => {
    const result = await this.listFiles({
      Bucket,
      path,
    });
    if (!result?.Contents || result.Contents.length === 0) {
      throw new BadRequestException('No files found');
    }
    const filesToDelete = result?.Contents?.map((item) => item.Key) as string[];
    const deleteResult = await this.deleteFiles({
      Bucket,
      urls: filesToDelete,
    });
    return deleteResult;
  };
}
