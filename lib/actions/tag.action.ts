'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { GetAllTagsParams, GetTopInteractedTagsParams } from './shared.types';
import Tag, { ITag } from '@/database/tag.model';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();
    const { userId, limit } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    // Find interactions for the user and group by tags...

    return {
      tags: [
        { _id: '0', name: 'Tag 1' },
        { _id: '1', name: 'Tag 2' },
      ],
    };
  } catch (error: any) {
    console.error('getTopInteractedTags', error);
    throw new Error(error);
  }
}

export async function getAllTags(
  params?: GetAllTagsParams
): Promise<{ tags: ITag[] }> {
  try {
    await connectToDatabase();

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const tags = await Tag.find({});

    if (!tags) throw new Error('Tags not found');

    return {
      tags,
    };
  } catch (error: any) {
    console.error('getAllTags', error);
    throw new Error(error);
  }
}
