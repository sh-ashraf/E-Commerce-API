import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AtLeastOne(
  RequireFields: string[],
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function (constructor: Function) {
    registerDecorator({
      target: constructor,
      propertyName: '',
      options: validationOptions,
      constraints: RequireFields,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return RequireFields.some((field) => args.object[field]);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultMessage(args: ValidationArguments) {
          return `At least one of the following fields must be provided: ${RequireFields.join(', ')}`;
        },
      },
    });
  };
}
