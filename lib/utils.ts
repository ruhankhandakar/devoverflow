import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';
import { BADGE_CRITERIA } from '@/constants';
import { BadgeCounts } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (date: Date): string => {
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDiff < minute) {
    return 'Just now';
  } else if (timeDiff < hour) {
    const minutesAgo = Math.floor(timeDiff / minute);
    return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else if (timeDiff < day) {
    const hoursAgo = Math.floor(timeDiff / hour);
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else if (timeDiff < week) {
    const daysAgo = Math.floor(timeDiff / day);
    return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else if (timeDiff < month) {
    const weeksAgo = Math.floor(timeDiff / week);
    return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
  } else if (timeDiff < year) {
    const monthsAgo = Math.floor(timeDiff / month);
    return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
  } else {
    const yearsAgo = Math.floor(timeDiff / year);
    return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
  }
};

export const formatNumberWithExtension = (number: number): string => {
  if (Math.abs(number) >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (Math.abs(number) >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number.toString();
  }
};

export const getJoinedDate = (dateObj: Date): string => {
  if (!(dateObj instanceof Date)) {
    return 'Invalid Date';
  }

  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();

  return `${month} ${year}`;
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
interface RemoveUrlQueryParams {
  params: string;
  keys: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

export const removeKeysFromQuery = ({ params, keys }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;

    const badgeLevels: any = BADGE_CRITERIA[type];
    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level as keyof BadgeCounts]) {
        badgeLevels[level] += 1;
      }
    });
  });
  return badgeCounts;
};
