import React from 'react';

import { getUserQuestions } from '@/lib/actions/user.action';
import { QuestionData, SearchParamsProps } from '@/types';
import QuestionCard from '../cards/QuestionCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab: React.FC<Props> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  const { questions } = await getUserQuestions({
    userId,
    page: 1,
  });

  return (
    <div>
      {questions.map((question: QuestionData) => (
        <QuestionCard
          key={JSON.stringify(question._id)}
          data={question}
          clerkId={clerkId}
        />
      ))}
    </div>
  );
};

export default QuestionsTab;
