import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure
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
    path: "/auth/refresh"
  };
} 

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export function setAuthCookies({ res, accessToken, refreshToken }: Params) {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenOptions());
};