import { userRepository } from '../user/user.repository.js';
import { hashPassword, comparePassword } from '../../shared/utils/password.js';
import {
  generateAccessToken,
  generateAuthTokens,
  verifyRefreshToken,
} from '../../shared/lib/jwt.js';
import { toSafeUser } from '../user/user.mapper.js';

import type { RegisterDto } from './validators/register.validator.js';
import type { LoginDto } from './validators/login.validator.js';

export class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    const createdUser = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const user = await userRepository.findById(createdUser.id);

    if (!user) {
      throw new Error('Failed to create user');
    }

    return toSafeUser(user);
  }

  async login(data: LoginDto) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
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
      throw new Error('Failed to update user');
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

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.hashedRefreshToken) {
      throw new Error('Invalid refresh token');
    }

    const isValid = await comparePassword(refreshToken, user.hashedRefreshToken);

    if (!isValid) {
      throw new Error('Invalid refresh token');
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
      throw new Error('User not found');
    }

    return toSafeUser(user);
  }
}

export const authService = new AuthService();
