import { UserTypes } from '../constants/enums';
import { AdminUserRepository } from '../db/rdb/repositories/admin-user.repository';
import { MigrationRepository } from '../db/rdb/repositories/migration.repository';
import { CustomException } from '../errors/CustomException.error';
import { UserPayload } from '../schema/token-payload.schema';
import { AuthenticatedRequest } from '../types/authenticate.type';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';

export class MigrationService {
  private userRepository: AppUserRepository;
  private migrationRepository: MigrationRepository;
  private adminUserRepo: AdminUserRepository;

  constructor() {
    this.userRepository = new AppUserRepository();
    this.migrationRepository = new MigrationRepository();
    this.adminUserRepo = new AdminUserRepository();
  }

  async authentication() {
    await this.migrationRepository.testConnection();
  }

  async migrate() {
    await this.migrationRepository.runMigration();
  }

  async refreshMigration() {
    await this.migrationRepository.refreshMigration();
  }

  async seed() {
    await this.migrationRepository.seedAdminUser();
  }

  async seedUserBalance(request: AuthenticatedRequest) {
    const user = request.user as UserPayload;

    const checkUser = await this.adminUserRepo.findUserById(user.id);

    if (!checkUser) throw new CustomException('User not found', 404);

    if (
      user.userType === UserTypes.ADMIN ||
      user.userType === UserTypes.SUPERADMIN
    ) {
      throw new CustomException('Admin balance user not allowed', 404);
    }

    await this.migrationRepository.seedUserBalance(user as UserPayload);
  }

  async seedEssentialData() {
    await this.migrationRepository.seedEssentialData();
  }

  async seedAppUser() {
    await this.migrationRepository.seedAppUser();
  }
}
