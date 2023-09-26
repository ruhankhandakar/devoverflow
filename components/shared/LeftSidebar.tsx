import React from 'react';
import { SignedOut } from '@clerk/nextjs';

import NavContent from './common/NavContent';
import { NavAuthSignIn, NavAuthSignUp } from './common/NavAuth';

const LeftSidebar = () => {
  return (
    <aside className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <NavContent sectionClassName="flex flex-1 flex-col gap-6" isForDweb />
      <SignedOut>
        <div className="flex flex-col gap-3">
          <NavAuthSignIn isForDweb />
          <NavAuthSignUp isForDweb />
        </div>
      </SignedOut>
    </aside>
  );
};

export default LeftSidebar;
