import { Schema } from 'mongoose';

import { BADGE_CRITERIA } from '@/constants';
import { IUser } from '@/database/user.model';

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: { id: string };
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export type ModeType = 'dark' | 'light';

export type Tags = {
  _id: Schema.Types.ObjectId;
  name: string;
  followers?: IUser[];
  questions: Schema.Types.ObjectId[];
  createdOn: Date;
};

export type Author = {
  _id: Schema.Types.ObjectId;
  name: string;
  picture: string;
};

export interface QuestionData {
  _id: Schema.Types.ObjectId;
  title: string;
  content: string;
  tags: Tags[];
  views: number;
  upvotes?: IUser[];
  downvotes?: IUser[];
  author: IUser;
  answers: Array<object>;
  createdAt: string;
}
