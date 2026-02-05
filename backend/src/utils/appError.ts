// App Error is a custom error class that is used when we want
// to throw errors in our business logic. Each app error will
// have an HTTP status code, a message and an optional error
// code.

import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
};

export default AppError;