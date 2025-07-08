import { TAppUserWithTimestamps } from '../types/types/app.user.type';
import { generateId } from '../utils/id.utils';
import { AppUserMockRepository } from '../db/mockDB/repositories/app-user.mock-repository';
import { IMockAppUserServiceInterface } from '../types/class-interfaces/app-user.interface';

export class AppUserMockService implements IMockAppUserServiceInterface
 {
  private appUserRepo: AppUserMockRepository;

  constructor() {
    this.appUserRepo = new AppUserMockRepository();
  }

  /**
   * Get paginated data.
   * @param page Page number for pagination
   * @param limit Controls how many data per page
   * @returns A promise that resolves into paginated data.
   */
  async getPaginated(page: number = 1, limit: number = 10) {
    return await this.appUserRepo.getPaginated(page, limit)
  }

  /**
   * Get all data.
   * @returns A promise that resolves to an array of all data(object/proxys).
   */
  async getAll() {
    return await this.appUserRepo.getAll();
  }

  /**
   * Find data by id.
   * @param id Id by which data is fetched.
   * @returns A promise that resolves to an object(data).
   */
  async findById(id: string) {
    return await this.appUserRepo.findById(id);
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
   * Create data.
   * @param data Validated data to store.
   * @returns A promise that resolves to the created data(object/proxy).
   */
  async create(data: Omit<TAppUserWithTimestamps, 'id'|'deletedAt'|'deletedBy'|'avatarUrl'|'createdAt'|'updatedAt' >) {
    return await this.appUserRepo.create({ 
      id: generateId(), 
      ...data,
      avatarUrl: null, 
      deletedAt: null, 
      deletedBy: null, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(), 
    });
  }

  /**
   * Update data.
   * @param data Validated data to update.
   * @param id Id by which data is updated.
   * @returns A promise that resolves to the updated data(object/proxy).
   */
  async update(data: TAppUserWithTimestamps, id: string) {

    return await this.appUserRepo.update({ 
        ...data,
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
      }, id
    );
  }

  /**
   * Soft delete data.
   * @param id Id by which data is deleted.
   * @returns A promise that resolves to the soft deleted data(object/proxy).
   */
  async delete(id: string) {
    return await this.appUserRepo.delete(id);
  }
}
