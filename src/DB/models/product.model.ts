import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Product {
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
    maxLength: 100000,
  })
  discription: string;

  @Prop({ type: String, required: true })
  mainImage: string;

  @Prop({ type: [String] })
  subImage: string[];

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, min: 0, max: 100 })
  discount: number;

  @Prop({ type: Number, min: 1 })
  quantity: number;

  @Prop({ type: Number, min: 1 })
  stock: number;

  @Prop({ type: Number })
  rateNumber: number;

  @Prop({ type: Number })
  averageRating: number;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brand: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SupCategory', required: true })
  subCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;
}
export type HProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as UpdateQuery<Product>;
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
ProductSchema.pre(['findOne', 'find', 'findOneAndUpdate'], function (next) {
  const { paranoid, ...rest } = this.getQuery();
  if (paranoid === false) {
    this.setQuery({ ...rest, deletedAt: { $exists: true } });
  } else if (paranoid === true) {
    this.setQuery({ ...rest, deletedAt: { $exists: false } });
  }
  next();
});
export const ProductModel = MongooseModule.forFeature([
  {
    name: Product.name,
    schema: ProductSchema,
  },
]);
