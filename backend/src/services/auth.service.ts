// Services are responsible for handling the business logic.
// They interact with the database and external services. 
// Services may also call other services.

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
}