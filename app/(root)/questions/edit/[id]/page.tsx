import React from 'react';

import Question from '@/components/forms/Question';

import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { getQuestionById } from '@/lib/actions/question.action';

const page = async ({ params }: ParamsProps) => {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  const mongoUser = await getUserById({ userId: clerkId });
  const { question } = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </>
  );
};

export default page;
