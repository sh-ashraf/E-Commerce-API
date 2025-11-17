import { Injectable } from '@nestjs/common';
import { DBRepository } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from '../models';
@Injectable()
export class subCategoryRepository extends DBRepository<SubCategory> {
  constructor(
    @InjectModel(SubCategory.name)
    protected override readonly model: Model<SubCategory>,
  ) {
    super(model);
  }
}
