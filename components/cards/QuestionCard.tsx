import React from 'react';
import Link from 'next/link';

import type { QuestionData } from '@/types';

import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';
import { formatNumberWithExtension, getTimeStamp } from '@/lib/utils';

interface Props {
  data: QuestionData;
}

const QuestionCard: React.FC<Props> = ({
  data: { title, createdAt, _id, tags, upvotes, answers, views, author },
}) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row ">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(new Date(createdAt))}
          </span>
          <Link href={`/questions/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* if signged in add edit/delete option */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag
            key={JSON.stringify(tag._id)}
            _id={JSON.stringify(tag._id)}
            name={tag.name}
          />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={`- asked ${getTimeStamp(new Date(createdAt))}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Up votes"
          value={formatNumberWithExtension(upvotes?.length || 0)}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumberWithExtension(answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumberWithExtension(views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
