import { Model } from "sequelize";


export type TAnyStringKeyValuePair = {
  [key: string]: string;
};

export type TFileUploaderFields = {
  name: string,
  maxCount: number
};

export type TPaginationResult<T extends Model> = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  nextPage: number | null;
  prevPage: number | null;
  records: T[];
};