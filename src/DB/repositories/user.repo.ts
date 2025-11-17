import { Injectable } from '@nestjs/common';
import { User } from '../models';
import { DBRepository } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UserRepository extends DBRepository<User> {
  constructor(
    @InjectModel(User.name)
    protected override readonly model: Model<User>,
  ) {
    super(model);
  }
}
