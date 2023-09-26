import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Props {
  isForDweb?: boolean;
}

export const NavAuthSignIn: React.FC<Props> = ({ isForDweb = false }) => (
  <Link href="/sign-in">
    <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
      {isForDweb && (
        <Image
          src="/assets/icons/account.svg"
          alt="login"
          width={20}
          height={20}
          className="invert-colors lg:hidden"
        />
      )}
      <span
        className={`primary-text-gradient ${isForDweb ? 'max-lg:hidden' : ''}`}
      >
        Log In
      </span>
    </Button>
  </Link>
);

export const NavAuthSignUp: React.FC<Props> = ({ isForDweb }) => (
  <Link href="/sign-up">
    <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
      {isForDweb && (
        <Image
          src="/assets/icons/sign-up.svg"
          alt="sign up"
          width={20}
          height={20}
          className="invert-colors lg:hidden"
        />
      )}
      <span className={isForDweb ? 'max-lg:hidden' : ''}>Sign up</span>
    </Button>
  </Link>
);
