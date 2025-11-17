import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class SubCategory {
  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
    minLength: 2,
    maxLength: 50,
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      return slugify(this.name, { lower: true, replacement: '-', trim: true });
    },
  })
  slug: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
    minLength: 2,
    maxLength: 20,
  })
  slogan: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  assetFolderId: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Brand' }], default: [] })
  brands: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;
}
export type SubCategoryDocument = HydratedDocument<SubCategory>;
export const subCategorySchema = SchemaFactory.createForClass(SubCategory);
subCategorySchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as UpdateQuery<SubCategory>;
  if (update.name) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    update.slug = slugify(update.name, {
      lower: true,
      replacement: '-',
      trim: true,
    });
  }
  next();
});
subCategorySchema.pre(['findOne', 'find', 'findOneAndUpdate'], function (next) {
  const { paranoid, ...rest } = this.getQuery();
  if (paranoid === false) {
    this.setQuery({ ...rest, deletedAt: { $exists: true } });
  } else if (paranoid === true) {
    this.setQuery({ ...rest, deletedAt: { $exists: false } });
  }
  next();
});
export const subCategoryModel = MongooseModule.forFeature([
  {
    name: SubCategory.name,
    schema: subCategorySchema,
  },
]);
