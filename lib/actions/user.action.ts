'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';

export async function getUserById(params: { userId: string }) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({
      clerkId: userId,
    });
    return user;
  } catch (error: any) {
    console.error('getUserById', error);
    throw new Error(error);
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error('createUser', error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();

    const { clerkId, path, updateData } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.error('updateUser', error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete user from database
    // And questions, answers, comments, etc. // We won't do it here

    const deletedUser = await User.findByIdAndUpdate(user._id, {
      isActive: false,
    });

    return deletedUser;
  } catch (error) {
    console.error('deleteUser', error);
    throw error;
  }
}
