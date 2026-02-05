import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

// A cookie is a small piece of data that a server asks the 
// client (browser) to store, and then the browser automatica-
// lly sends it back with future requests to the same server.

export const REFRESH_PATH = "/auth/refresh";
const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,  // not accessible by JS (prevents XXS)
  secure // sent only over HTTPS
};

function getAccessTokenCookieOptions(): CookieOptions {
  return {
    ...defaults,
    expires: fifteenMinutesFromNow()
  };
};

function getRefreshTokenOptions(): CookieOptions {
  return {
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: REFRESH_PATH // cookie is only sent on requests to this path
  };
} 

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

// the res.cookie sets a cookie on the client.

// sets both cookies in the response, ready for secure
// client storage.
export function setAuthCookies({ res, accessToken, refreshToken }: Params) {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenOptions());
};

export function clearAuthCookies(res: Response) {
  return res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: REFRESH_PATH
  });
};