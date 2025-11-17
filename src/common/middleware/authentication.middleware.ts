import type { Request, Response, NextFunction } from 'express';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { TokenService } from '../services';
import { UserWithRequest } from '../interfaces';
import { TokenTypeEnum } from '../enums';

export const tokenType = (typeToken: TokenTypeEnum = TokenTypeEnum.access) => {
  return (req: UserWithRequest, res: Response, next: NextFunction) => {
    req.typeToken = typeToken;
    next();
  };
};

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: UserWithRequest, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      const [prefix, token] = authorization?.split(' ') || [];
      if (!token || !prefix) {
        throw new BadRequestException('Invalid Token');
      }
      const signature = await this.tokenService.GetSignature(
        prefix,
        req.typeToken,
      );
      if (!signature) {
        throw new BadRequestException('Invalid signature');
      }
      const { user, decoded } =
        await this.tokenService.decodedTokenAndFetchUser(token, signature);

      req.user = user;
      req.decoded = decoded;
      return next();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
  }
}
