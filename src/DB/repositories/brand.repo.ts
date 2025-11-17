import { Injectable } from '@nestjs/common';
import { DBRepository } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from '../models';
@Injectable()
export class BrandRepository extends DBRepository<Brand> {
  constructor(
    @InjectModel(Brand.name)
    protected override readonly model: Model<Brand>,
  ) {
    super(model);
  }
}
