import { Injectable } from '@nestjs/common';
import { DBRepository } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from '../models';
@Injectable()
export class OtpRepository extends DBRepository<Otp> {
  constructor(
    @InjectModel(Otp.name)
    protected override readonly model: Model<Otp>,
  ) {
    super(model);
  }
}
