import { IMockAppUserRepositoryInterface } from '../../../types/class-interfaces/app-user.interface';
import { TAppUserWithTimestamps } from '../../../types/types/app.user.type';
import { TMockPaginationResult } from '../../../types/types/common.type';
import { mockPaginatedResults } from '../../../utils/common.utils';
import { appUsers } from '../app-users';
export class AppUserMockRepository implements IMockAppUserRepositoryInterface {
  constructor() {}

  /**
   * Get paginated data.
   * @param page Page number for pagination
   * @param limit Controls how many data per page
   * @param sortOrder The order of sorting
   * @param sortBy The column to sort by
   * @param searchText Full text search. Which columns will be searched is defined inside the repository.
   * @returns A promise that resolves into paginated data.
   */

  async getPaginated(page: number = 1, limit: number = 10): Promise<TMockPaginationResult> {
    const data = appUsers.filter((appUser) => appUser.deletedAt === null)
    return mockPaginatedResults(data, page, limit); // use your actual pagination logic
  }

  /**
   * Get all data.
   * @param select Which columns to get.
   * @returns A promise that resolves to an array of all data(object/proxys).
   */
  async getAll(): Promise<TAppUserWithTimestamps[]> {
    const data = appUsers.filter((appUser) => appUser.deletedAt === null)
    return data;
  }

  /**
   * Find data by id.
   * @param id Id by which data is fetched.
   * @param select Which columns to get.
   * @returns A promise that resolves to an object(data).
   */
  async findById(id: string): Promise<TAppUserWithTimestamps> {
    const data = appUsers.find((appUser) => appUser.id === id)
    return data!;
  }

  /**
   * Query if data exists by id.
   * @param id Id by which data is queried.
   * @returns A promise that resolves a boolean.
   */
  async existsById(id: string): Promise<boolean> {
    const data = appUsers.find((appUser) => appUser.id === id)

    if(data) return true;

    return false
  }

  /**
   * Create data.
   * @param data Validated data to store.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the created data(object/proxy).
   */
  async create(data: TAppUserWithTimestamps): Promise<TAppUserWithTimestamps> {
    appUsers.push({ ...data})
    return data;
  }

  /**
   * Update data.
   * @param data Validated data to update.
   * @param id Id by which data is updated.
   * @returns A promise that resolves to the updated data(object/proxy).
   */
  async update(data: TAppUserWithTimestamps, id: string): Promise<TAppUserWithTimestamps> {
    const index = appUsers.findIndex(appUser => appUser.id === id)
    if (index !== -1) 
      appUsers[index] = { ...appUsers[index], ...data }

    return appUsers[index]
  }

  /**
   * Soft delete data.
   * @param id Id by which data is deleted.
   * @returns A promise that resolves to the soft deleted data(object/proxy).
   */
  async delete(id: string): Promise<TAppUserWithTimestamps> {
    const index = appUsers.findIndex(appUser => appUser.id === id);
    if (index !== -1) 
      appUsers[index].deletedAt = new Date().toISOString();

    return appUsers[index];
  }
}
