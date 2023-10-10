'use server';
import { FilterQuery } from 'mongoose';

import User, { IUser } from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Tag from '@/database/tag.model';
import Question from '@/database/question.model';
import Answer from '@/database/answer.model';
import { QuestionData } from '@/types';

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error('User not found');

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.error('getUserInfo', error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, 'i') } },
        { username: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'new_users':
        sortOptions = { joinedAt: -1 };
        break;
      case 'old_users':
        sortOptions = { joinedAt: 1 };
        break;
      case 'top_contributors':
        sortOptions = { reputation: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const users = (await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)) as IUser[];

    const totalUsers = await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    console.error('getAllUsers', error);
    throw new Error(error);
  }
}

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

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.error('deleteUser', error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error('user not found');

    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      // add question from saved
      await User.findByIdAndUpdate(
        userId,
        {
          $push: { saved: questionId },
        },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.error('toggleSaveQuestion', error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase();

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case 'most_recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'most_voted':
        sortOptions = { upvotes: -1 };
        break;
      case 'most_viewed':
        sortOptions = { views: -1 };
        break;
      case 'most_answered':
        sortOptions = { answers: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    });

    if (!user) throw new Error('User not found');
    const savedQuestions = user.saved;

    const isNext = user.saved.length > pageSize;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.error('getSavedQuestions', error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = (await Question.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate('tags', '_id name')
      .populate('author', '_id clerkId name picture')) as QuestionData[];

    return {
      totalQuestions,
      questions: userQuestions,
    };
  } catch (error) {
    console.error('getUserQuestions', error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate('question', '_id title')
      .populate('author', '_id clerkId name picture');

    return {
      totalAnswers,
      answers: userAnswers,
    };
  } catch (error) {
    console.error('getUserQuestions', error);
    throw error;
  }
}

// export async function testFunc(params: TestParams){
//   try {
//     await connectToDatabase();

//   } catch (error) {
//     console.error('testFunc', error);
//     throw error;
//   }
// }
