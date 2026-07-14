import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env.js";
import type { UserRole } from "../../modules/user/user.constants.js";

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  sub: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const accessTokenOptions: SignOptions = {
  expiresIn: env.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
};

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, accessTokenOptions);
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshTokenOptions);
};

export const generateAuthTokens = (payload: AccessTokenPayload): AuthTokens => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ sub: payload.sub }),
  };
};

export const verifyAccessToken = (
  token: string
): AccessTokenPayload & JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload &
    JwtPayload;
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload & JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload &
    JwtPayload;
};
