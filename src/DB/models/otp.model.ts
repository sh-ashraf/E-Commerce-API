import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OtpEnumType } from 'src/common/enums/otp.enum';
import { eventEmitter } from 'src/common/services';
import { Hash } from 'src/common/utilits/hash';
@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Date, required: true })
  expireAt: Date;

  @Prop({ type: String, enum: OtpEnumType, required: true })
  type: OtpEnumType;
}
export type HOtpDocument = HydratedDocument<Otp>;
export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.pre(
  'save',
  async function (
    this: HOtpDocument & { is_new: boolean; plainCode: string },
    next,
  ) {
    if (this.isModified('code')) {
      this.plainCode = this.code;
      this.is_new = this.isNew;
      this.code = await Hash(this.code);
      await this.populate([
        {
          path: 'createdBy',
          select: 'email',
        },
      ]);
    }
    next();
  },
);
// eslint-disable-next-line @typescript-eslint/require-await
OtpSchema.post('save', async function (doc, next) {
  const that = this as HOtpDocument & { is_new: boolean; plainCode: string };
  if (that.is_new) {
    eventEmitter.emit(doc.type, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      email: (doc.createdBy as any).email,
      otp: that.plainCode,
    });
  }
  next();
});
OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
export const OtpModel = MongooseModule.forFeature([
  {
    name: Otp.name,
    schema: OtpSchema,
  },
]);
