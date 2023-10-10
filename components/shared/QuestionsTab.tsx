import React from 'react';

import { getUserQuestions } from '@/lib/actions/user.action';
import { QuestionData, SearchParamsProps } from '@/types';
import QuestionCard from '../cards/QuestionCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab: React.FC<Props> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  const { questions, isNext } = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {questions.map((question: QuestionData) => (
        <QuestionCard
          key={JSON.stringify(question._id)}
          data={question}
          clerkId={clerkId}
        />
      ))}
      <div className="mt-5">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default QuestionsTab;
