import { storageType } from 'src/common/enums';
import { fileValidation } from './multer.fileValidation';
import multer from 'multer';
import os from 'os';
import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
export const multerCloud = ({
  fileTypes = fileValidation.image,
  storeType = storageType.memory,
}: {
  fileTypes?: string[];
  storeType?: storageType;
}) => {
  return {
    storage:
      storeType === storageType.memory
        ? multer.memoryStorage()
        : multer.diskStorage({
            destination: os.tmpdir(),
            filename(req: Request, file: Express.Multer.File, cb) {
              cb(null, `${Date.now()}_${file.originalname}`);
            },
          }),
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      cb: Function,
    ) => {
      if (!fileTypes.includes(file.mimetype)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        cb(new BadRequestException('Invalid file type'), false);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        cb(null, true);
      }
    },
  };
};
