import multer from 'multer';
import type { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const multerLocal = ({ fileTypes = [] }: { fileTypes: string[] }) => {
  return {
    storage: multer.diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        cb: Function,
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        cb(null, './uploads');
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      if (fileTypes.includes(file.mimetype)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        cb(null, true);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        cb(new BadRequestException('invalid file type'));
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  };
};
