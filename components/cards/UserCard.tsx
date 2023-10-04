import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { IUser } from '@/database/user.model';
import { getTopInteractedTags } from '@/lib/actions/tag.action';
import { Badge } from '../ui/badge';
import RenderTag from '../shared/RenderTag';

interface Props {
  user: IUser;
}

const UserCard: React.FC<Props> = async ({ user }) => {
  const { tags } = await getTopInteractedTags({ userId: user._id });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex-center w-full flex-col rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          height={100}
          width={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
        <div className="mt-5 ">
          {tags.length ? (
            <div className="flex items-center gap-2">
              {tags.map((tag) => (
                <RenderTag key={tag._id} name={tag.name} _id={tag._id} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
