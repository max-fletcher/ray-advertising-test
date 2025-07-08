import { getEnvVar } from '../utils/common.utils';

const port = Number(getEnvVar('REDIS_PORT'));
const host = getEnvVar('REDIS_HOST');
const username = getEnvVar('REDIS_USERNAME');
const password = getEnvVar('REDIS_PASSWORD');
const db = Number(getEnvVar('REDIS_DB'));

export const nodeCacheConfig = {
  port: port, // Redis port
  host: host, // Redis host
  username: username, // needs Redis >= 6
  password: password,
  db: db, // Defaults to 0
};
