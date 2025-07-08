import { Sequelize } from 'sequelize';
import { getEnvVar } from '../../utils/common.utils';
import { getDBClient } from '../../utils/db-client.utils';

export class UserClient {
  private static instance: Sequelize | null = null;
  private static dbName = getEnvVar('USER_DB_NAME');
  private static username = getEnvVar('USER_DB_USERNAME');
  private static password = getEnvVar('USER_DB_PASSWORD');
  private static endpoint = getEnvVar('USER_DB_ENDPOINT');
  private static port = getEnvVar('USER_DB_PORT');

  constructor() {}

  public static getInstance(): Sequelize {
    if (!UserClient.instance) {
      UserClient.instance = getDBClient(
        UserClient.dbName,
        UserClient.username,
        UserClient.password,
        UserClient.endpoint,
        UserClient.port,
      );
    }
    return UserClient.instance;
  }
}
