'use client';

import React, { FC, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { SheetClose } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { useAuth } from '@clerk/nextjs';

interface Props {
  sectionClassName?: string;
  isForDweb?: boolean;
}
const NavContent: FC<Props> = ({
  sectionClassName = '',
  isForDweb = false,
}) => {
  const { userId } = useAuth();
  const pathName = usePathname();

  return (
    <section className={sectionClassName || 'flex h-full flex-col gap-6 pt-16'}>
      {sidebarLinks.map((link) => {
        const isActive =
          (pathName.includes(link.route) && link.route.length > 1) ||
          pathName === link.route;

        if (link.route === '/profile') {
          if (userId) {
            link.route = `${link.route}/${userId}`;
          } else {
            return null;
          }
        }

        const linkComp = (
          <Link
            href={link.route}
            className={`${
              isActive
                ? 'primary-gradient rounded-lg text-light-900'
                : 'text-dark300_light900'
            } flex items-center justify-start gap-4 bg-transparent p-4`}
          >
            <Image
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
              className={isActive ? '' : 'invert-colors'}
            />
            <p
              className={`${isActive ? 'base-bold' : 'base-medium'} ${
                isForDweb ? 'max-lg:hidden' : ''
              }`}
            >
              {link.label}
            </p>
          </Link>
        );

        if (isForDweb) {
          return <Fragment key={link.route}>{linkComp}</Fragment>;
        }

        return (
          <SheetClose asChild key={link.route}>
            {linkComp}
          </SheetClose>
        );
      })}
    </section>
  );
};

export default NavContent;
