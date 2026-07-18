import { Types } from "mongoose";

import { ApiError, ERROR_CODES } from "../errors/index.js";

/**
 * Route params arrive as arbitrary strings, and `new Types.ObjectId(value)`
 * throws a raw BSON error on anything malformed — which surfaces as a 500 for
 * what is really a bad request. Check the shape at the edge instead.
 */
export function assertObjectId(
  value: string,
  label: string
): string {
  if (!Types.ObjectId.isValid(value)) {
    throw ApiError.badRequest(
      `Invalid ${label}`,
      ERROR_CODES.INVALID_PARAMETER
    );
  }

  return value;
}
