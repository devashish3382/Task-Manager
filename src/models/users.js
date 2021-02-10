const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/tasks')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true

  },
  age: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email address is not correct');
      }
    }
  },
  password: {
    type: String,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password in invalid')
      }
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  profilepicture:{
    type:Buffer
  }
},{timestamps:true});

userSchema.virtual('tasks',{
  ref:Task,
  localField:'_id',
  foreignField:'owner'
});

userSchema.pre('remove',async function(next){
  let user = this;
  await Task.deleteMany({owner:user._id});
  next();
})

userSchema.methods.getPublicInfo = function () {
  let user = this;
  let publicDetails = user.toObject();
  delete publicDetails.password;
  return publicDetails;
}
userSchema.methods.GenerateAuthToken = async function () {
  let user = this;
  let token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}
userSchema.statics.findByCredentials = async (email, password) => {
  let user = await User.findOne({ email });
  if (!user)
    throw new Error('Unable to Login');
  let isMatch = await bcryptjs.compare(password, user.password)
  if (!isMatch)
    throw new Error('Unable to Login');
  return user;
}
userSchema.pre('save', async function (next) {
  let user = this;
  let pass = user.password;
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(pass, 8);
  }
  next();
})
const User = mongoose.model('users', userSchema);
module.exports = User;