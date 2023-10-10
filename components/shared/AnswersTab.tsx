import React from 'react';

import { SearchParamsProps } from '@/types';
import { getUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab: React.FC<Props> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  const { answers, isNext } = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {answers.map((item) => (
        <AnswerCard
          key={item._id}
          clerkId={clerkId}
          _id={item._id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
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

export default AnswersTab;
