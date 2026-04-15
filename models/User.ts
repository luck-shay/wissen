import { Schema, Document, Types, models, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string; // hashed
  role?: "user" | "admin";
  squad: number;
  batch: number; // 1 or 2
  defaultSeat: number; // 1 to 40
}

export interface IUserDocument extends IUser, Document {}

export interface IUserLean extends IUser {
  _id: Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    squad: { type: Number },
    batch: { type: Number },
    defaultSeat: { type: Number },
  },
  { timestamps: true },
);

const User = models.User ?? model<IUserDocument>("User", UserSchema);

export default User;
