const { Schema, model } = require('mongoose');
const { hash, compare } = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new Schema(
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
      validate: [isEmail, 'Please provide a valid email'],
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

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = model('User', userSchema);

module.exports = User;
