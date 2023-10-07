import React from 'react';

import { SearchParamsProps } from '@/types';
import { getUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab: React.FC<Props> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  const { answers } = await getUserAnswers({
    userId,
    page: 1,
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
    </>
  );
};

export default AnswersTab;
