import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AppUserModel } from '../../db/rdb/models/app-user.model';

export type TAppUser = InferAttributes<AppUserModel>;

export type TStoreAppUser = Partial<InferCreationAttributes<AppUserModel>> & {
  id: string
  email: string
  password: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type TStoreAppUserData = Omit<TStoreAppUser, 'id'>;

export type TUpdateAppUserData = Partial<TStoreAppUserData>;

export type TAppUserWithTimestamps = TAppUser & {
  createdAt: string
  updatedAt: string
};