'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import { SearchParams } from './shared.types';
import User from '@/database/user.model';
import Answer from '@/database/answer.model';
import Tag from '@/database/tag.model';

const SearchAbleTypes = ['question', 'user', 'answer', 'tag'];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();

    const { query, type } = params;

    const regexQuery = {
      $regex: query,
      $options: 'i',
    };

    let results = [];

    const modelsAndType = [
      { model: Question, searchField: 'title', type: 'question' },
      { model: User, searchField: 'name', type: 'user' },
      { model: Answer, searchField: 'content', type: 'answer' },
      { model: Tag, searchField: 'name', type: 'tag' },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchAbleTypes.includes(typeLower)) {
      // Search Across everything
      for (const { model, searchField, type } of modelsAndType) {
        const queryResult = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);
        results.push(
          ...queryResult.map((result) => ({
            title:
              type === 'answer'
                ? `Answer containing ${query}`
                : result[searchField],
            type,
            id:
              type === 'user'
                ? result.clerkId
                : type === 'answer'
                ? result.question
                : result.id,
          }))
        );
      }
    } else {
      // Search in the specified modal
      const modalInfo = modelsAndType.find((model) => model.type === typeLower);

      if (!modalInfo) {
        throw new Error('Invalid search type');
      }

      const queryResult = await modalInfo.model
        .find({
          [modalInfo.searchField]: regexQuery,
        })
        .limit(8);
      results = queryResult.map((result) => ({
        title:
          type === 'answer'
            ? `Answer containing ${query}`
            : result[modalInfo.searchField],
        type,
        id:
          type === 'user'
            ? result.clerkId
            : type === 'answer'
            ? result.question
            : result.id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log('error fetching global result', error);
    throw error;
  }
}
