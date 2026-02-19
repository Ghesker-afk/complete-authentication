// Controllers are responsible for validating the request,
// calling the appropriate service, and sending back the
// response.

import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser, refreshUserAccessToken, sendPasswordResetEmail, verifyEmail } from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenOptions, setAuthCookies } from "../utils/cookies";
import { emailSchema, loginSchema, registerSchema, verificationCodeSchema } from "./auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";

export const registerHandler = catchErrors(
  async(req, res) => {
    // validate request
    const request = registerSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"]
  });

    // call service
    const {user, accessToken, refreshToken} = await createAccount(request);

    // return response
    return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json({ user });
  }
);

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body, 
    userAgent: req.headers["user-agent"]
    });

  const {accessToken, refreshToken, user} = await loginUser(request);

  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({ message: "Login successful" });
});

export const logoutHandler = catchErrors(async (req, res) => {
 
  // first step: we will grab the access token from the cookie
  const accessToken = req.cookies.accessToken as string | undefined;

  // we wanna verify the token, because if it's valid, we
  // want to delete the session that's assigned to this
  // access token.
  const { payload, error } = verifyToken(accessToken || "");

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId)
  }

  // the last step is to clear our cookies, so when the user
  // logs out, we wanna clear all of their cookies so they
  // will not present in any subsequent request.

  return clearAuthCookies(res).status(OK).json({
    message: "Logout successfully"
  });
});

export const refreshHandler = catchErrors(async (req, res) => {
  // First, we'll validate the request.
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  // We will call our service (once the request was validated)
  const {
    accessToken,
    newRefreshToken
  } = await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
    message: "Access token refreshed"
  });

});

export const emailVerifyHandler = catchErrors(async (req, res) => {

  // First, we must validate the request. So, we will create
  // a zod schema to ensure that verification code contains
  // at least 1 character and at max 24 characters.
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  // Second, we will call the service.
  await verifyEmail(verificationCode);

  return res.status(OK).json({
    message: "Email was successfully verified"
  });
});

export const sendPasswordResetHandler = catchErrors(async(req, res) => {
  const email = emailSchema.parse(req.body.email);

  // call service
  await sendPasswordResetEmail(email);

  return res.status(OK).json({
    message: "Password reset email sent"
  });
});