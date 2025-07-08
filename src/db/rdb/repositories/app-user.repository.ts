import { Op, Transaction } from 'sequelize';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { TPaginationResult } from '../../../types/types/common.type';
import { TAppUser, TStoreAppUser, TUpdateAppUserData } from '../../../types/types/app.user.type';
import { AppUserModel } from '../models';
import { paginatedResults } from '../../../utils/common.utils';
import { IAppUserRepositoryInterface } from '../../../types/class-interfaces/app-user.interface';
export class AppUserRepository implements IAppUserRepositoryInterface {
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
  async getPaginated(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<TPaginationResult<AppUserModel>> {
    const options: any = {
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [[sortBy, sortOrder]],
      attributes: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'deletedAt', 'deletedBy', 'createdAt', 'updatedAt'],
    }

    if(searchText)
      options.where = { 
        ...options.where,
        [Op.or]: [
          { email: { [Op.iLike]: `%${searchText}%` } },
          { firstName: { [Op.iLike]: `%${searchText}%` } },
          { lastName: { [Op.iLike]: `%${searchText}%` } }
        ]
        
      }

    console.log('options', options)

    return await paginatedResults(AppUserModel, options, page, limit) as TPaginationResult<AppUserModel>; // use your actual pagination logic
  }


  /**
   * Get all data.
   * @param select Which columns to get.
   * @returns A promise that resolves to an array of all data(object/proxys).
   */
  async getAll(select: string[]|null = null): Promise<TAppUser[]> {
    const options: any = {
      where: {
        deletedAt: {
          [Op.eq]: null
        },
      },
      order: [['createdAt', 'DESC']],
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserModel.findAll(options)) as unknown as TAppUser[];
  }

  /**
   * Find data by id.
   * @param id Id by which data is fetched.
   * @param select Which columns to get.
   * @returns A promise that resolves to an object(data).
   */
  async findById(id: string, select: string[]|null = null): Promise<TAppUser> {
    const options: any = {
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    }

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserModel.findOne(options)) as unknown as TAppUser;
  }

  /**
   * Query if data exists by id.
   * @param id Id by which data is queried.
   * @returns A promise that resolves a boolean.
   */
  async existsById(id: string): Promise<number> {
    return await AppUserModel.count({
      where: {
        id: id,
        deletedAt:{
          [Op.eq]: null
        }
      },
    });
  }

  /**
   * Find data by an array of ids.
   * @param ids Ids by which data is queried.
   * @returns A promise that resolves to an array of data(object/proxys).
   */
  async findByIds(ids: string[]): Promise<TAppUser[]> {
    return (await AppUserModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
          deletedAt:{
            [Op.eq]: null
          } 
        },
      },
    })) as unknown as TAppUser[];
  }
  
  /**
   * Create data.
   * @param data Validated data to store.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the created data(object/proxy).
   */
  async create(data: TStoreAppUser, transaction?: Transaction): Promise<TAppUser> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await AppUserModel.create(data, options) as unknown as TAppUser;
  }

  /**
   * Update data.
   * @param data Validated data to update.
   * @param id Id by which data is updated.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the updated data(object/proxy).
   */
  async update(data: TUpdateAppUserData, id: string, transaction?: Transaction): Promise<TAppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserModel.update(data, options)) as unknown as TAppUser;
  }

  /**
   * Soft delete data.
   * @param id Id by which data is deleted.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the soft deleted data(object/proxy).
   */
  async delete(id: string, transaction?: Transaction): Promise<TAppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await AppUserModel.update({ deletedAt: datetimeYMDHis() }, options) as unknown as TAppUser;
  }

  /**
   * Hard delete data.
   * @param id Id by which data is hard deleted.
   * @param transaction (Optional) DB transaction.
   * @returns A promise that resolves to the hard deleted data(object/proxy).
   */
  async hardDeleteById(id: string, transaction?: Transaction): Promise<TAppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserModel.destroy(options)) as unknown as TAppUser;
  }
}
