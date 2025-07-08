import { Transaction } from 'sequelize';
import { IAppUserServiceInterface } from '../types/class-interfaces/app-user.interface';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import { TStoreAppUserData, TUpdateAppUserData } from '../types/types/app.user.type';
import { generateId } from '../utils/id.utils';

export class AppUserService implements IAppUserServiceInterface {
  private appUserRepo: AppUserRepository;

  constructor() {
    this.appUserRepo = new AppUserRepository();
  }

  async getPaginated(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null) {
    return await this.appUserRepo.getPaginated(page, limit, sortOrder, sortBy, searchText)
  }

  async getAll(select: string[]|null = null) {
    return await this.appUserRepo.getAll(select);
  }

  async findById(id: string, select: string[]|null = null) {
    return await this.appUserRepo.findById(id, select);
  }

  async existsById(id: string) {
    return await this.appUserRepo.existsById(id);
  }

  async findByIds(ids: string[]) {
    return await this.appUserRepo.findByIds(ids);
  }

  async create(data: TStoreAppUserData, transaction?: Transaction) {
    return await this.appUserRepo.create({ id: generateId(), ...data }, transaction);
  }

  async update(data: TUpdateAppUserData, id: string, transaction?: Transaction) {
    return await this.appUserRepo.update(data, id, transaction);
  }

  async delete(id: string, transaction?: Transaction) {
    return await this.appUserRepo.delete(id, transaction);
  }

  async hardDeleteById(id: string, transaction?: Transaction) {
    return await this.appUserRepo.hardDeleteById(id, transaction);
  }
}
