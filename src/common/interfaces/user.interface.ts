import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HUserDocument } from 'src/DB';
import { TokenTypeEnum } from '../enums';
export interface UserWithRequest extends Request {
  user: HUserDocument;
  decoded: JwtPayload;
  typeToken: TokenTypeEnum;
}
