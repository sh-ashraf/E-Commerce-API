import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserGender, UserProvider, UserRole } from 'src/common/enums';
import { HydratedDocument } from 'mongoose';
import type { HOtpDocument } from './otp.model';
import { Hash } from 'src/common/utilits/hash';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    trim: true,
  })
  lastName: string;

  // userName will be defined as a virtual on the schema
  userName?: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  password: string;
  @Prop({
    type: Number,
    min: 18,
    max: 100,
    required: true,
  })
  age: number;
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
  @Prop({
    type: String,
    enum: UserGender,
    default: UserGender.MALE,
  })
  gender: UserGender;
  @Prop({
    type: String,
    enum: UserProvider,
    default: UserProvider.LOCAL,
  })
  provider: UserProvider;
  @Prop({
    type: String,
    required: false,
  })
  image?: string;
  @Prop({
    type: Date,
    default: Date.now,
  })
  changeCredentials: Date;

  @Prop({
    default: false,
  })
  confirmed: boolean;
  @Prop({
    type: Date,
  })
  otpExpires: Date;

  // otp will be defined as a virtual on the schema
  otp?: HOtpDocument;
}
export const UserSchema = SchemaFactory.createForClass(User);
export type HUserDocument = HydratedDocument<User>;

// Add virtuals
UserSchema.virtual('userName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (value: string) {
    const [firstName, lastName] = value.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
  });

UserSchema.virtual('otp', {
  ref: 'Otp',
  localField: '_id',
  foreignField: 'createdBy',
  justOne: true,
});

// Add pre-save middleware for password hashing
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await Hash(this.password);
  }
  next();
});

export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);
