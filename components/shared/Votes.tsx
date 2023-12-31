'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import {
  downvoteQuestion,
  upvoteQuestion,
} from '@/lib/actions/question.action';
import { formatNumberWithExtension } from '@/lib/utils';
import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action';
import { toggleSaveQuestion } from '@/lib/actions/user.action';
import { viewQuestion } from '@/lib/actions/interacton.action';
import { useToast } from '../ui/use-toast';

interface Props {
  type: 'Question' | 'Answer';
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes: React.FC<Props> = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}) => {
  const { toast } = useToast();

  const pathName = usePathname();
  const router = useRouter();

  const handleVote = async (action: 'upvote' | 'downvote') => {
    if (!userId) {
      return toast({
        title: 'Please log in',
        description: 'You must be logged in to perform this action',
      });
    }
    if (action === 'upvote') {
      if (type === 'Question') {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          userId: JSON.parse(userId),
          path: pathName,
        });
      } else if (type === 'Answer') {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          userId: JSON.parse(userId),
          path: pathName,
        });
      }
      return toast({
        title: `Upvote ${!hasUpvoted ? 'Successful' : 'Removed'}`,
        variant: !hasUpvoted ? 'default' : 'destructive',
      });
    }

    if (action === 'downvote') {
      if (type === 'Question') {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          userId: JSON.parse(userId),
          path: pathName,
        });
      } else if (type === 'Answer') {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          userId: JSON.parse(userId),
          path: pathName,
        });
      }
      return toast({
        title: `Downvote ${!hasDownvoted ? 'Successful' : 'Removed'}`,
        variant: !hasDownvoted ? 'default' : 'destructive',
      });
    }
  };
  const handleSave = async () => {
    try {
      await toggleSaveQuestion({
        userId: JSON.parse(userId),
        questionId: JSON.parse(itemId),
        path: pathName,
      });
    } catch (error) {
      console.log('handleSave error', error);
    }
  };

  useEffect(() => {
    if (type === 'Question') {
      console.log('viewQuestion');

      viewQuestion({
        questionId: JSON.parse(itemId),
        userId: userId ? JSON.parse(userId) : undefined,
      });
    }
  }, [itemId, userId, pathName, router, type]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === 'Question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt="saved"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default React.memo(Votes);
