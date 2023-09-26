'use client';

import React from 'react';
import Image from 'next/image';

import { Input } from '@/components/ui/input';

interface Props {
  route: string;
  iconPosition: 'left' | 'right';
  imgSrc: string;
  placeholder: string;
  otherClasses: string;
}

const LocalSearch: React.FC<Props> = ({
  route,
  iconPosition = 'left',
  imgSrc,
  placeholder,
  otherClasses = '',
}) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        {iconPosition === 'left' && (
          <Image
            src={imgSrc}
            alt="search icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          value=""
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
          onChange={() => {}}
        />
        {iconPosition === 'right' && (
          <Image
            src={imgSrc}
            alt="search icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default LocalSearch;
