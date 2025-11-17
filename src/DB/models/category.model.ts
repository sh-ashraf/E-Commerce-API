import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Category {
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
}
export type HCategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as UpdateQuery<Category>;
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
CategorySchema.pre(['findOne', 'find', 'findOneAndUpdate'], function (next) {
  const { paranoid, ...rest } = this.getQuery();
  if (paranoid === false) {
    this.setQuery({ ...rest, deletedAt: { $exists: true } });
  } else if (paranoid === true) {
    this.setQuery({ ...rest, deletedAt: { $exists: false } });
  }
  next();
});
export const CategoryModel = MongooseModule.forFeature([
  {
    name: Category.name,
    schema: CategorySchema,
  },
]);
