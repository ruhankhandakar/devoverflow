'use client';

import { deleteAnswer } from '@/lib/actions/answer.action';
import { deleteQuestion } from '@/lib/actions/question.action';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface Props {
  type: 'Question' | 'Answer';
  itemId: string;
}

const EditDeleteAction: React.FC<Props> = ({ type, itemId }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/questions/edit/${JSON.parse(itemId)}`);
  };

  const handleDelete = async () => {
    if (type === 'Question') {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else if (type === 'Answer') {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === 'Question' && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          height={14}
          width={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        height={14}
        width={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
