import { EnvVarNotFoundError } from '../errors/envvar.notfound.error';
import dotenv from 'dotenv';

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
