import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

@ValidatorConstraint({ name: 'matchFields', async: false })
export class MatchFields implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return value === args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must match with ${args.constraints[0]}`;
  }
}

export function IsMatch(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: MatchFields,
    });
  };
}
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.user;
  },
);
