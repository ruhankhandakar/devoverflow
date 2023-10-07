'use server';
import { FilterQuery } from 'mongoose';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from './shared.types';
import Tag, { ITag } from '@/database/tag.model';
import Question from '@/database/question.model';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();
    const { userId } = params;

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

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    });

    if (!tag) throw new Error('User not found');
    const questions = tag.questions;

    return { questions, tagTitle: tag.name };
  } catch (error: any) {
    console.error('getQuestionByTagId', error);
    throw new Error(error);
  }
}

export async function getPopularTags() {
  try {
    // Connect to DB
    await connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.error('getPopularTags', error);
    throw error;
  }
}
