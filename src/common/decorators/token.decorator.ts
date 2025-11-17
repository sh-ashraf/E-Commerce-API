import { SetMetadata } from '@nestjs/common';
import { TokenTypeEnum } from '../enums';
export const TOKEN_KEY = 'typeToken';
export const Token = (tokenType: TokenTypeEnum = TokenTypeEnum.access) => {
  return SetMetadata(TOKEN_KEY, tokenType);
};
