import { Sequelize } from 'sequelize';
import { UserClient } from '../../../db/clients/postgres.client';
import { seedAppUsers } from '../seeders/app-users.seeder';

export class MigrationRepository {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = UserClient.getInstance();
  }

  async testConnection() {
    await this.sequelize.authenticate();
  }

  async runMigration() {
    await this.sequelize.sync({ alter: true });
  }

  async refreshMigration() {
    await this.sequelize.sync({ force: true });
  }

  async seedAppUser() {
    await seedAppUsers();
  }
}
