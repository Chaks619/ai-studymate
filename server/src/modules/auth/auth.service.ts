import { userRepository } from '../user/user.repository.js';
import { hashPassword, comparePassword } from '../../shared/utils/password.js';
import {
  generateAuthTokens,
  verifyRefreshToken,
} from '../../shared/lib/jwt.js';
import { toSafeUser } from '../user/user.mapper.js';
import { ApiError, ERROR_CODES } from '../../shared/errors/index.js';

import type { RegisterDto } from './validators/register.validator.js';
import type { LoginDto } from './validators/login.validator.js';

export class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw ApiError.conflict(
        'User already exists',
        ERROR_CODES.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await hashPassword(data.password);

    const createdUser = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const user = await userRepository.findById(createdUser.id);

    if (!user) {
      throw ApiError.internal('Failed to create user');
    }

    return toSafeUser(user);
  }

  async login(data: LoginDto) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw ApiError.unauthorized(
        'Invalid email or password',
        ERROR_CODES.INVALID_CREDENTIALS
      );
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized(
        'Invalid email or password',
        ERROR_CODES.INVALID_CREDENTIALS
      );
    }

    const tokens = generateAuthTokens({
      sub: user.id,
      role: user.role,
    });

    const hashedRefreshToken = await hashPassword(tokens.refreshToken);

    await userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    const updatedUser = await userRepository.updateById(user.id, {
      lastLogin: new Date(),
    });

    if (!updatedUser) {
      throw ApiError.internal('Failed to update user');
    }

    return {
      user: toSafeUser(updatedUser),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, null);
  }

  async refreshToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const user = await userRepository.findByIdWithRefreshToken(payload.sub);

    // The token parsed, but its subject is gone. Reported as a bad token
    // rather than a missing user — the caller is not authenticated, and
    // saying which accounts exist tells an attacker something.
    if (!user) {
      throw ApiError.unauthorized(
        'Invalid refresh token',
        ERROR_CODES.INVALID_REFRESH_TOKEN
      );
    }

    if (!user.hashedRefreshToken) {
      throw ApiError.unauthorized(
        'Invalid refresh token',
        ERROR_CODES.INVALID_REFRESH_TOKEN
      );
    }

    const isValid = await comparePassword(refreshToken, user.hashedRefreshToken);

    if (!isValid) {
      throw ApiError.unauthorized(
        'Invalid refresh token',
        ERROR_CODES.INVALID_REFRESH_TOKEN
      );
    }

    const tokens = generateAuthTokens({
      sub: user.id,
      role: user.role,
    });

    const hashedRefreshToken = await hashPassword(tokens.refreshToken);

    await userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      user: toSafeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async me(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw ApiError.notFound(
        'User not found',
        ERROR_CODES.USER_NOT_FOUND
      );
    }

    return toSafeUser(user);
  }
}

export const authService = new AuthService();
