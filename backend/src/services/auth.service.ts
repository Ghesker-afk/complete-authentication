// Services are responsible for handling the business logic.
// They interact with the database and external services. 
// Services may also call other services.

import UserModel from "../models/user.model";

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

  if (existingUser) {
    throw new Error("User already exists.");
  }

  // second step: create the user 

  // create() creates and persists a new document, apply-
  // ing schema validation and middleware before saving.
  const user = await UserModel.create({
    email: data.email,
    password: data.password
  });
}