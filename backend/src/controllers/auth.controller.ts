// Controllers are responsible for validating the request,
// calling the appropriate service, and sending back the
// response.

import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schemas";
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

  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");
});