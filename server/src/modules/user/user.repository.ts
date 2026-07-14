import { UserModel, type UserDocument } from './user.model.js';

export class UserRepository {
  async create(userData: Partial<UserDocument>): Promise<UserDocument> {
    return await UserModel.create(userData);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await UserModel.findById(id);
  }

  async findByIdWithRefreshToken(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).select('+hashedRefreshToken');
  }

  async findByIdWithPassword(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).select('+password');
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({
      email: email.toLowerCase(),
    }).select('+password +hashedRefreshToken');
  }

  async updateById(id: string, updateData: Partial<UserDocument>): Promise<UserDocument | null> {
    return await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<UserDocument | null> {
    return await UserModel.findByIdAndDelete(id);
  }

  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string | null
  ): Promise<UserDocument | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      {
        hashedRefreshToken,
      },
      {
        new: true,
      }
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }
}

export const userRepository = new UserRepository();
