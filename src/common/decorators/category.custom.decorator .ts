import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'IdsMongo', async: false })
export class IdsMongo implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(ids: string[], args: ValidationArguments) {
    return ids.filter((id) => Types.ObjectId.isValid(id)).length === ids.length;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return `All provided IDs must be valid MongoDB ObjectIds`;
  }
}
