import { userRepository } from "./user.repository.js";
import { toSafeUser, type SafeUser, type UserPreferences } from "./user.mapper.js";

import { workspaceRepository } from "../workspace/workspace.repository.js";
import { documentRepository } from "../document/document.repository.js";
import { summaryRepository } from "../summary/summary.repository.js";
import { flashcardRepository } from "../flashcards/flashcard.repository.js";
import { quizRepository } from "../quiz/quiz.repository.js";

import { comparePassword, hashPassword } from "@/shared/utils/password.js";
import { ApiError, ERROR_CODES } from "@/shared/errors/index.js";
import {
  destroyCloudinaryAsset,
  uploadAvatarToCloudinary,
} from "@/shared/utils/cloudinary-upload.js";

import type {
  ChangePasswordDto,
  UpdatePreferencesDto,
  UpdateProfileDto,
} from "./user.validation.js";

export class UserService {
  /**
   * The settings UI saves one section at a time, so the patch is merged onto
   * the user's current preferences. Assigning the whole subdocument (rather
   * than dot-notation paths) is safe because `toSafeUser` always hands back a
   * fully-populated object, defaults included.
   */
  async updatePreferences(
    user: SafeUser,
    patch: UpdatePreferencesDto
  ): Promise<SafeUser> {
    const merged: UserPreferences = {
      ...user.preferences,
      ...patch,

      autoGenerate: {
        ...user.preferences.autoGenerate,
        ...patch.autoGenerate,
      },
    } as UserPreferences;

    const updated = await userRepository.updateById(user.id, {
      preferences: merged,
    });

    if (!updated) {
      throw ApiError.notFound(
        "User not found",
        ERROR_CODES.USER_NOT_FOUND
      );
    }

    return toSafeUser(updated);
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileDto
  ): Promise<SafeUser> {
    const updated = await userRepository.updateById(userId, {
      name: data.name,
    });

    if (!updated) {
      throw ApiError.notFound(
        "User not found",
        ERROR_CODES.USER_NOT_FOUND
      );
    }

    return toSafeUser(updated);
  }

  async updateAvatar(
    user: SafeUser,
    file: Express.Multer.File
  ): Promise<SafeUser> {
    const result = await uploadAvatarToCloudinary(file.buffer, user.id);

    const updated = await userRepository.updateById(user.id, {
      avatar: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });

    if (!updated) {
      throw ApiError.notFound(
        "User not found",
        ERROR_CODES.USER_NOT_FOUND
      );
    }

    return toSafeUser(updated);
  }

  async changePassword(
    userId: string,
    data: ChangePasswordDto
  ): Promise<void> {
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw ApiError.notFound(
        "User not found",
        ERROR_CODES.USER_NOT_FOUND
      );
    }

    const isCurrentPasswordValid = await comparePassword(
      data.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw ApiError.unauthorized(
        "Current password is incorrect",
        ERROR_CODES.INVALID_CREDENTIALS
      );
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await userRepository.updateById(userId, {
      password: hashedPassword,
      // Every other session is now stale — force a fresh login there.
      hashedRefreshToken: null,
    });
  }

  /**
   * Removes the user and everything hanging off them: workspaces, documents,
   * and the summaries / flashcards / quizzes generated from those documents,
   * plus the uploaded PDFs and avatar in Cloudinary.
   */
  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw ApiError.notFound(
        "User not found",
        ERROR_CODES.USER_NOT_FOUND
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized(
        "Password is incorrect",
        ERROR_CODES.INVALID_CREDENTIALS
      );
    }

    const documents = await documentRepository.findAllByOwner(userId);

    const documentIds = documents.map((document) => document.id as string);

    if (documentIds.length > 0) {
      await Promise.all([
        summaryRepository.deleteManyByDocuments(documentIds),
        flashcardRepository.deleteManyByDocuments(documentIds),
        quizRepository.deleteManyByDocuments(documentIds),
      ]);
    }

    await documentRepository.deleteManyByOwner(userId);
    await workspaceRepository.deleteManyByOwner(userId);
    await userRepository.deleteById(userId);

    // Remote files last: the account is already gone from the user's point of
    // view, and destroyCloudinaryAsset swallows its own failures.
    await Promise.all([
      ...documents.map((document) =>
        destroyCloudinaryAsset(document.file?.publicId ?? "", "raw")
      ),

      destroyCloudinaryAsset(user.avatar?.publicId ?? "", "image"),
    ]);
  }
}

export const userService = new UserService();
