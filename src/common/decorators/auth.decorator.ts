import { applyDecorators, UseGuards } from '@nestjs/common';
import { TokenTypeEnum, UserRole } from '../enums';
import { Token } from './token.decorator';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Role } from './role.decorator';
import { AuthenticationGuard } from '../guards';

export function Auth({
  tokenType = TokenTypeEnum.access,
  role = [UserRole.USER],
}: {
  tokenType?: TokenTypeEnum;
  role?: UserRole[];
} = {}) {
  return applyDecorators(
    Token(tokenType),
    Role(role),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
