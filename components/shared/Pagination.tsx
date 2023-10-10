'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils';

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination: React.FC<Props> = ({ pageNumber, isNext }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: 'prev' | 'next') => {
    const nextPageNumber =
      direction === 'prev' ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div className="flex-center w-full gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
        className="light-border-2 btn flex-center min-h-[36px] gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
        className="light-border-2 btn flex-center min-h-[36px] gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
