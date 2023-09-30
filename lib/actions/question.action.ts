'use server';
import { revalidatePath } from 'next/cache';

import { connectToDatabase } from '../mongoose';
import Question from '@/database/question.model';
import User from '@/database/user.model';
import Tag from '@/database/tag.model';
import { CreateQuestionParams, GetQuestionsParams } from './shared.types';
import { QuestionData } from '@/types';

export async function getQuestions(params?: GetQuestionsParams) {
  try {
    // Connect to DB
    await connectToDatabase();

    const questions = (await Question.find({})
      .populate({
        path: 'tags',
        model: Tag,
      })
      .populate({
        path: 'author',
        model: User,
      })) as QuestionData[];
    return { questions };
  } catch (error) {
    console.error('getQuestions', error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // Connect to DB
    await connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create a new Question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagsDocuments = [];

    // Create the tags or get the tags from the DB
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}$`, 'i'),
          },
        },
        {
          $setOnInsert: {
            name: tag,
          },
          $push: {
            questions: question._id,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      tagsDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: {
        tags: {
          $each: tagsDocuments,
        },
      },
    });

    // Increment author's reputation by +5 for creating new question

    revalidatePath(path);
  } catch (error) {}
}
