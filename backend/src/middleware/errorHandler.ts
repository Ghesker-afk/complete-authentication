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
import { BAD_REQUEST } from "../constants/http";

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

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {

  // The "path" property contains the path part of the
  // request URL, as "/users", "/register", "/refresh", etc.
  console.log(`PATH: ${req.path}`, error);

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  return res.status(500).send("Internal Server Error");
};

export default errorHandler;