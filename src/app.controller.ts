import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { S3Service } from 'src/common/services';
import type { Request, Response, NextFunction } from 'express';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('upload/*path')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async GetFile(@Req() req: Request, @Res() res: Response, next: NextFunction) {
    const { path } = req.params as unknown as { path: string[] };
    const key = path.join('/');
    const result = await this.s3Service.getFile({ path: key });
    const stream = result.Body as unknown as NodeJS.ReadStream;
    res.set('cross-origin-resource-policy', 'cross-origin');
    res.setHeader(
      'Content-Type',
      result.ContentType || 'application/octet-stream',
    );
    stream.pipe(res);
  }
}
