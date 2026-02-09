// Errors are handled using a custom error handler middleware.
// The error handler middleware catches all errors that occur
// in the application and processes them accordingly. Each
// controller needs to be wrapped with the errorCatch()
// utility function to ensure that any errors that are thrown
// within the controller are caught and passed on to the
// error handler middleware.

// The req object represents the HTTP request and has 
// properties for the request query string, parameters, body,
// HTTP headers, and so on.

import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/appError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";

function handleZodError(res: Response, error: z.ZodError) {
  const errors = error.issues.map((err) => (
    {
      path: err.path.join("."),
      message: err.message
    }
  ));

  return res.status(BAD_REQUEST).json({
    message: error.message,
    errors 
  });
}

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode
  });
}

const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {

  // The "path" property contains the path part of the
  // request URL, as "/users", "/register", "/refresh", etc.
  console.log(`PATH: ${req.path}`, error);

  // All the cookies will be cleared when an error occurs on
  // this path.
  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;