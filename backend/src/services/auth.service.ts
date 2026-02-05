// Services are responsible for handling the business logic.
// They interact with the database and external services. 
// Services may also call other services.

import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export async function createAccount(data: CreateAccountParams) {
  // verify existing user doesn't exist, if not, we will
  // create the user and a verification code (through email)
  // then we will send email, and create a session in our 
  // system. Finally, sign the access token and refresh token
  // and return the new user / tokens.

  // first step: verify if the user exists

  // exists() checks whether at least one document matching
  // the filter exists in the collection. A filter is a
  // query object that describes the conditions a document
  // must satisfy to be considered a match.
  const existingUser = await UserModel.exists({
    email: data.email
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  // second step: create the user 

  // create() creates and persists a new document, apply-
  // ing schema validation and middleware before saving.
  const user = await UserModel.create({
    email: data.email,
    password: data.password
  });

  // third step: create the verification code
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow()
  });

  // five step: create session

  // A session is gonna represent a unit of time that a
  // user is logged in. Our session will be valid for 30
  // days, and the users will be able to use the access
  // and the refresh tokens to stay logged in. 
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent
  });

  // sixth step: sign access token & refresh token

  // The payload is the data encoded in the token, and
  // you can later decode it to know which session / user
  // the token belongs to. The secret is the cryptographic
  // key for signing, and options includes expiration, audi-
  // ence, issuer, etc.

  // Refresh token: long-lived, used to get new access
  // tokens without logging in again.
  const refreshToken = jwt.sign({sessionId: session._id},  JWT_REFRESH_SECRET, {
    audience: ["user"],
    expiresIn: "30d"
  });

  // Access token: short-lived, used to get access
  // protected resources.
  const accessToken = jwt.sign({sessionId: session._id},  JWT_SECRET, {
    audience: ["user"],
    expiresIn: "15m"
  });

  // seventh step: return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken
  };
}