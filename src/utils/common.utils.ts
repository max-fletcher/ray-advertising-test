import { FindOptions, Model, ModelStatic } from 'sequelize';
import { EnvVarNotFoundError } from '../errors/envvar.notfound.error';
import dotenv from 'dotenv';
import { TMockPaginationResult, TPaginationResult } from '../types/types/common.type';

dotenv.config();

export function getEnvVar(paramName: string): string {
  const value = process.env[paramName];
  const exceptionList = [
    'USER_DB_PASSWORD',
    'REDIS_PORT',
    'REDIS_HOST',
    'REDIS_USERNAME',
    'REDIS_PASSWORD',
    'REDIS_DB',
  ];

  if (!value && value !== '') {
    throw new EnvVarNotFoundError(
      `Environment variable ${paramName} not found`,
    );
  }

  if (value === '' && !exceptionList.includes(paramName)) {
    throw new EnvVarNotFoundError(`Environment variable ${paramName} is empty`);
  }

  return value;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const fieldNames = Object.freeze({
  AVATAR: 'avatar',
});

export const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const getMimeTypeValidationMsg = (validTypes: string[]) => {
  const validExtensions = validTypes.map(
    (item) => '.' + item.substring(item.lastIndexOf('/') + 1),
  );
  if (validExtensions.length > 1) {
    const lastExtension = validExtensions.pop();
    return [validExtensions.join(', '), lastExtension].join(' or ');
  }
  return validExtensions.join(', ');
};

export const isEmptyObject = (obj: any) => {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true
}

export function getOTPExpiry(): number {
  return Number(getEnvVar('OTP_EXPIRY'));
}

/**
 * Paginate data.
 * @param model Sequelize model.
 * @param query Query object that contains the query logic.
 * @param page Page number.
 * @param pageSize How many records to fetch.
 * @returns A promise that resolves to the paginated data.
 */
export const paginatedResults = async <T extends Model>(
  model: ModelStatic<T>,
  query: FindOptions<T>,
  page = 1,
  pageSize = 10,
): Promise<TPaginationResult<T>> => {
  // Calculate offset based on page number and page size
  const offset = (page - 1) * pageSize;

  // Clone the query object to avoid modifying the original. Also delete attributes since "select" interferes with "count" query
  const totalCountQuery = { ...query };
  delete totalCountQuery.attributes;

  // Find the total count
  const totalCount = (await model.count(totalCountQuery)) as unknown as number;

  query.offset = offset;
  query.limit = pageSize;

  // Query records for the current page with pagination
  const records = await model.findAll(query);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Determine next page
  const nextPage = page < totalPages ? page + 1 : null;

  // Determine previous page
  const prevPage = page > 1 ? page - 1 : null;

  return {
    page,
    pageSize,
    totalPages,
    totalCount,
    nextPage,
    prevPage,
    records,
  };
};

export const mockPaginatedResults = async(
  data: any,
  page = 1,
  pageSize = 10,
): Promise<TMockPaginationResult> => {
  // Calculate offset based on page number and page size
  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  // Find the total count
  const totalCount = data.length;

  // Query records for the current page with pagination
  const records = data.slice(start, end);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Determine next page
  const nextPage = page < totalPages ? page + 1 : null;

  // Determine previous page
  const prevPage = page > 1 ? page - 1 : null;

  return {
    page,
    pageSize,
    totalPages,
    totalCount,
    nextPage,
    prevPage,
    records,
  };
};