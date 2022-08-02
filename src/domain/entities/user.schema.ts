import mongoose from 'mongoose';

export interface User {
  _id?: string;
  name: string;
  username: string;
  password?: string;
}

export type UserDocument = User & Document;

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
