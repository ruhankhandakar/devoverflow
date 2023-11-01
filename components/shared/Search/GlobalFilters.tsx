'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { GlobalSearchFilters } from '@/constants/filters';
import { formUrlQuery } from '@/lib/utils';

const GlobalFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeParams = searchParams.get('type');

  const [active, setActive] = useState(typeParams || '');

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <button
            key={filter.value}
            className={`light-border-2 small-medium cursor-pointer rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 ${
              active === filter.value
                ? 'bg-primary-500 text-light-900'
                : 'bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500'
            }`}
            type="button"
            onClick={() => handleTypeClick(filter.value)}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
