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

  /**
   * Get paginated data.
   * @param page Page number for pagination
   * @param limit Controls how many data per page
   * @param sortOrder The order of sorting
   * @param sortBy The column to sort by
   * @param searchText Full text search. Which columns will be searched is defined inside the repository.
   * @returns A promise that resolves into paginated data.
   */
  async getPaginated(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null) {
    return await this.appUserRepo.getPaginated(page, limit, sortOrder, sortBy, searchText)
  }

  /**
   * Get all data.
   * @param select Which columns to get.
   * @returns A promise that resolves to an array of all data(object/proxys).
   */
  async getAll(select: string[]|null = null) {
    return await this.appUserRepo.getAll(select);
  }

  /**
   * Find data by id.
   * @param id Id by which data is fetched.
   * @param select Which columns to get.
   * @returns A promise that resolves to an object(data).
   */
  async findById(id: string, select: string[]|null = null) {
    return await this.appUserRepo.findById(id, select);
  }

  /**
   * Query if data exists by id.
   * @param id Id by which data is queried.
   * @returns A promise that resolves a boolean.
   */
  async existsById(id: string) {
    return await this.appUserRepo.existsById(id);
  }

  /**
   * Find data by an array of ids.
   * @param ids Ids by which data is queried.
   * @returns A promise that resolves to an array of data(object/proxys).
   */
  async findByIds(ids: string[]) {
    return await this.appUserRepo.findByIds(ids);
  }

  /**
   * Create data.
   * @param data Validated data to store.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the created data(object/proxy).
   */
  async create(data: TStoreAppUserData, transaction?: Transaction) {
    return await this.appUserRepo.create({ id: generateId(), ...data }, transaction);
  }

  /**
   * Update data.
   * @param data Validated data to update.
   * @param id Id by which data is updated.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the updated data(object/proxy).
   */
  async update(data: TUpdateAppUserData, id: string, transaction?: Transaction) {
    return await this.appUserRepo.update(data, id, transaction);
  }

  /**
   * Soft delete data.
   * @param id Id by which data is deleted.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the soft deleted data(object/proxy).
   */
  async delete(id: string, transaction?: Transaction) {
    return await this.appUserRepo.delete(id, transaction);
  }

  /**
   * Hard delete data.
   * @param id Id by which data is hard deleted.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the hard deleted data(object/proxy).
   */
  async hardDeleteById(id: string, transaction?: Transaction) {
    return await this.appUserRepo.hardDeleteById(id, transaction);
  }
}
