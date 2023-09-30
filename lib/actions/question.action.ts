'use server';

import { connectToDatabase } from '../mongoose';

export async function createQuestion(params) {
  try {
    // Connect to DB
    await connectToDatabase();

    console.log('params', params);
  } catch (error) {}
}
