import { AppUserModel } from '../db/rdb/models/app-user.model';
import { InferAttributes } from 'sequelize';

export type UserMongo = {
  email: string;
  name: string;
};

export type User = InferAttributes<AppUserModel>;

export type UserWithTimeStamps = {
  id: string,
  name: string|null,
  username: string|null,
  email: string|null,
  phone: string|null,
  whatsapp_no: string|null,
  avatar_url: string|null,
  country: string|null,
  currency_id: string|null,
  status: string|null,
  verified: boolean|null,
  guest: boolean|null,
  createdAt?: string;
  updatedAt?: string;
};

export type AppUserGenerateToken = {
  id: string,
  name: string|null,
  username: string|null,
  email: string|null,
  phone: string|null,
  whatsapp_no: string|null,
  verified: boolean,
  guest: boolean,
};

export type UserUpdate = {
  name?: string|null,
  username?: string|null,
  email?: string|null,
  password?: string|null,
  phone?: string|null,
  whatsapp_no?: string|null,
  otp?: string|null,
  otp_expires_at?: string|null,
  providers?: UserProviders,
  google_id?: string|null,
  facebook_id?: string|null,
  apple_id?: string|null,
  profile_image_url?: string|null,
  avatar_url?: string|null,
  status?: string,
  verified?: boolean,
  guest?: boolean,
  stripe_customer_id?: string|null,
  notifications?: string,
  createdAt?: string,
  updatedAt?: string,
}

export type UserAllDataTypes = UserWithTimeStamps & {
  password: string | null;
  otp: string | null;
  otp_expires_at: string | null;
  providers: UserProviders;
  google_id: string | null;
  facebook_id: string | null;
  apple_id: string | null;
  profile_image_url: string | null;
  avatar_url: string | null;
};

export type UserProfileResponse = {
  id: string,
  name?: string|null,
  username: string|null,
  email: string|null,
  phone: string,
  whatsapp_no: string|null,
  country: string|null,
  currency: string,
  profile_image_url: null,
  avatar_url: string|null,
  status?: string,
  verified?: boolean,
  guest?: boolean,
  createdAt?: string,
  profile_completion?: number,
  balance: {
    cash_balance: number;
    coin_balance: number;
  };
  tier: null | {
    id: string;
    name: string;
  };
};

export type AnyStringKeyValuePair = {
  [key: string]: string;
};

export type UserProviders = {
  [key: string]: {
    uid: string;
    username: string;
    email: string;
    phone: string;
  };
}[];

export type SocialAuthProviders = 'google'|'facebook'|'apple'
