import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { TokenService } from '../services';
import { Reflector } from '@nestjs/core';
import { TOKEN_KEY } from '../decorators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const typeToken = this.reflector.get(TOKEN_KEY, context.getHandler());
    let req: any;
    let authorization: string = '';
    if (context.getType() === 'http') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req = context.switchToHttp().getRequest();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      authorization = req.headers.authorization;
    }
    try {
      const [prefix, token] = authorization?.split(' ') || [];
      if (!token || !prefix) {
        throw new BadRequestException('Invalid Token');
      }
      const signature = await this.tokenService.GetSignature(prefix, typeToken);
      if (!signature) {
        throw new BadRequestException('Invalid signature');
      }
      const { user, decoded } =
        await this.tokenService.decodedTokenAndFetchUser(token, signature);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.user = user;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.decoded = decoded;
      return true;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
  }
}
