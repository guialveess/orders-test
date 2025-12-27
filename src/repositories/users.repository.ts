import User from "../models/users/user.schema";
import { IUser } from "../models/users/user.interface";
import { Types } from "mongoose";

export class UsersRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = await User.create(userData);
    return user.toObject() as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user ? user.toObject() as IUser : null;
  }

  async findById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await User.findById(id);
    return user ? user.toObject() as IUser : null;
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    return user ? user.toObject() as IUser : null;
  }

  async delete(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const user = await User.findByIdAndDelete(id);
    return user ? user.toObject() as IUser : null;
  }
}

export const usersRepository = new UsersRepository();
