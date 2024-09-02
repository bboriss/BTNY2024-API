import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  passwordChangedAt?: Date;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: [true, 'Please provide your username'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
      trim: true,
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      trim: true,
      minlength: 8,
      select: false,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
