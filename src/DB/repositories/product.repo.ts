import { Injectable } from '@nestjs/common';
import { DBRepository } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../models';
@Injectable()
export class ProductRepository extends DBRepository<Product> {
  constructor(
    @InjectModel(Product.name)
    protected override readonly model: Model<Product>,
  ) {
    super(model);
  }
}
