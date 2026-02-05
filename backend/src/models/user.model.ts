import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";


// The Document inheritance provides TypeScript typings for 
// a Mongoose document, including built-in document methods 
// and custom fields.
export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string) : Promise<boolean>;
  omitPassword(): Pick<UserDocument, "_id" | "email" | "verified" | "createdAt" | "updatedAt">;
};

// A schema defines the structure, rules and behavior
// of documents within a MongoDB collection.
const userSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false }
}, {

  // The timestamps option enables automatic tracking of
  // document creation and update times.

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

// Schema methods: functions attached to a schema that
// can be called on individual documents to operate on
// that document's data.
userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// A model is a compiled representation of a schema that
// provides an interface to interact with a MongoDB
// collection. It's the tool you use to work with the data.
const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;