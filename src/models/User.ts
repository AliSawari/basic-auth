import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 8
  },
})

export const User = model("User", userSchema)