'use server';

import { connectToDatabase } from '../mongoose';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';

type ParamsType = {
  title: string;
  content: string;
  tags: string[];
  author: string;
  path?: string;
};

export async function createQuestion(params: ParamsType) {
  try {
    // Connect to DB
    await connectToDatabase();

    const { title, content, tags, author } = params;

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
  } catch (error) {}
}
