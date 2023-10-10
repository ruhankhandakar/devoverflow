'use server';
import { revalidatePath } from 'next/cache';

import Answer from '@/database/answer.model';
import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import {
  GetAnswersParams,
  CreateAnswerParams,
  AnswerVoteParams,
  DeleteAnswerParams,
} from './shared.types.d';
import InterAction from '@/database/interaction.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    // Connect to DB
    await connectToDatabase();

    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    // Add the answer to question's answer array
    await Question.findByIdAndUpdate(question, {
      $push: {
        answers: newAnswer._id,
      },
    });

    // TODO: Add interaction

    revalidatePath(path);
  } catch (error) {
    console.error('createAnswer', error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    // Connect to DB
    await connectToDatabase();

    const { questionId, sortBy } = params;

    let sortOptions = {};

    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvotes: -1 };
        break;
      case 'lowestUpvotes':
        sortOptions = { upvotes: 1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'old':
        sortOptions = { createdAt: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .sort(sortOptions);
    return { answers };
  } catch (error) {
    console.error('getAnswers', error);
    throw error;
  }
}

export async function upvoteAnswer(parms: AnswerVoteParams) {
  try {
    // Connect to DB
    await connectToDatabase();

    const { answerId, userId, path, hasdownVoted, hasupVoted } = parms;

    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = {
        $pull: {
          upvotes: userId,
        },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: {
          downvotes: userId,
        },
        $push: {
          upvotes: userId,
        },
      };
    } else {
      updateQuery = {
        $addToSet: {
          upvotes: userId,
        },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    // Increment author's reputation by +10 for upvoting a question

    revalidatePath(path);
  } catch (error) {
    console.error('upvoteAnswer', error);
    throw error;
  }
}

export async function downvoteAnswer(parms: AnswerVoteParams) {
  try {
    // Connect to DB
    await connectToDatabase();

    const { answerId, userId, path, hasdownVoted, hasupVoted } = parms;

    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = {
        $pull: {
          downvotes: userId,
        },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: {
          upvotes: userId,
        },
        $push: {
          downvotes: userId,
        },
      };
    } else {
      updateQuery = {
        $addToSet: {
          downvotes: userId,
        },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    // Increment author's reputation by +10 for upvoting a question

    revalidatePath(path);
  } catch (error) {
    console.error('downvoteAnswer', error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    // Connect to DB
    await connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) throw new Error('Answer not found');

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      {
        $pull: {
          answers: answerId,
        },
      }
    );
    await InterAction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.error('deleteQuestion', error);
    throw error;
  }
}
