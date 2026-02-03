import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { compareValue, hashValue } from "../utils/bcrypt";


// The Document inheritance provides TypeScript typings for 
// a Mongoose document, including built-in document methods 
// and custom fields.
export interface UserDocument extends Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string) : Promise<boolean>
};

const userSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false }
}, {
  timestamps: true
});

// Hooks: functions that run automatically at specific points
// in our document lifecycle. It's a code that "hooks into"
// Mongoose operations and runs before or after they happen.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  // Important: "this" refers to the document.
  this.password = await hashValue(this.password);
});

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

const userModel = mongoose.model<UserDocument>("User", userSchema);
export default userModel;