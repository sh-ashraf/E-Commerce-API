import { Injectable } from '@nestjs/common';
import { DBRepository } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../models';
@Injectable()
export class CategoryRepository extends DBRepository<Category> {
  constructor(
    @InjectModel(Category.name)
    protected override readonly model: Model<Category>,
  ) {
    super(model);
  }
}
