'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';

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
