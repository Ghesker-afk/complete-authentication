
import assert from "node:assert";
import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";
import AppError from "./appError";

type AppAssert = (
  condition: any,
  HttpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode: AppErrorCode
) => asserts condition;

/**
 * Asserts a condition and throws an AppError if the 
 * condition is false
 */
const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;