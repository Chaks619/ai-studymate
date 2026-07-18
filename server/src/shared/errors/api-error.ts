import { ERROR_CODES, type ErrorCode } from "./error-codes.js";
import { HTTP_STATUS } from "./http-status.js";

/**
 * An error the API meant to produce: the status and message are safe to send
 * to the client as-is. Anything else reaching the error middleware is a bug,
 * and is reported as a 500 without echoing its message back.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: ErrorCode = ERROR_CODES.INTERNAL_ERROR
  ) {
    super(message);

    this.name = "ApiError";

    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(
    message: string,
    code: ErrorCode = ERROR_CODES.VALIDATION_FAILED
  ) {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      message,
      code
    );
  }

  static unauthorized(
    message: string,
    code: ErrorCode = ERROR_CODES.UNAUTHORIZED
  ) {
    return new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      message,
      code
    );
  }

  static forbidden(
    message: string,
    code: ErrorCode = ERROR_CODES.UNAUTHORIZED
  ) {
    return new ApiError(
      HTTP_STATUS.FORBIDDEN,
      message,
      code
    );
  }

  static notFound(message: string, code: ErrorCode) {
    return new ApiError(
      HTTP_STATUS.NOT_FOUND,
      message,
      code
    );
  }

  static conflict(message: string, code: ErrorCode) {
    return new ApiError(
      HTTP_STATUS.CONFLICT,
      message,
      code
    );
  }

  static unprocessable(
    message: string,
    code: ErrorCode
  ) {
    return new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message,
      code
    );
  }

  static internal(
    message: string,
    code: ErrorCode = ERROR_CODES.INTERNAL_ERROR
  ) {
    return new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message,
      code
    );
  }

  static badGateway(message: string, code: ErrorCode) {
    return new ApiError(
      HTTP_STATUS.BAD_GATEWAY,
      message,
      code
    );
  }

  static unavailable(
    message: string,
    code: ErrorCode
  ) {
    return new ApiError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      message,
      code
    );
  }
}
