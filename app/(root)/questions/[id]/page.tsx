import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Metric from '@/components/shared/Metric';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';

import { getQuestionById } from '@/lib/actions/question.action';
import { formatNumberWithExtension, getTimeStamp } from '@/lib/utils';
import Votes from '@/components/shared/Votes';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { URLProps } from '@/types';

const Page = async ({ params, searchParams }: URLProps) => {
  const { question } = await getQuestionById({ questionId: params.id });
  const { userId: clerkId } = auth();

  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question.author.picture}
              height={22}
              width={22}
              alt={question.author.name}
              className="rounded-full "
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={question.upvotes?.length || 0}
              hasUpvoted={!!question.upvotes?.includes(mongoUser._id)}
              downvotes={question.downvotes?.length || 0}
              hasDownvoted={!!question.downvotes?.includes(mongoUser._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={`Asked ${getTimeStamp(new Date(question.createdAt))}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumberWithExtension(question.answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumberWithExtension(question.views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />

      <div className="mt-4 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <RenderTag
            key={JSON.stringify(tag._id)}
            _id={JSON.stringify(tag._id)}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={JSON.stringify(question._id)}
        userId={mongoUser._id}
        totalAnswers={question.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <Answer
        author={JSON.stringify(mongoUser._id)}
        questionId={JSON.stringify(question._id)}
      />
    </>
  );
};

export default Page;
