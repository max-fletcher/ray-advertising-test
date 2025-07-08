import { Sequelize } from 'sequelize';

export function getDBClient(
  dbName: string,
  username: string,
  password: string,
  endpoint: string,
  port: string,
): Sequelize {
  if (process.env.APP_ENV === 'local') {
    return new Sequelize(dbName, username, password, {
      host: endpoint,
      port: Number(port),
      dialect: 'postgres',
      dialectModule: require('pg'),
      ssl: false,
    });
  } else if (process.env.APP_ENV === 'staging') {
    return new Sequelize(dbName, username, password, {
      host: endpoint,
      dialect: 'postgres',
      dialectModule: require('pg'),
      ssl: false,
      pool: {
        max: 2,
        min: 0,
        idle: 0,
        acquire: 6000,
        evict: 6000,
      },
    });
  } else {
    return new Sequelize(dbName, username, password, {
      host: endpoint,
      dialect: 'postgres',
      dialectModule: require('pg'),
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
        },
      },
      define: {
        freezeTableName: true,
      },
      pool: {
        max: 2,
        min: 0,
        idle: 0,
        acquire: 3000,
        evict: 3000,
      },
    });
  }
}
