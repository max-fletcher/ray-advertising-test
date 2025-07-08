import { Op, Transaction } from 'sequelize';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { TPaginationResult } from '../../../types/types/common.type';
import { TAppUser, TStoreAppUser, TUpdateAppUserData } from '../../../types/types/app.user.type';
import { AppUserModel } from '../models';
import { paginatedResults } from '../../../utils/common.utils';
import { IAppUserRepositoryInterface } from '../../../types/class-interfaces/app-user.interface';
export class AppUserRepository implements IAppUserRepositoryInterface {
  constructor() {}

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

  async getPaginated(page: number = 1, limit: number = 10, sortOrder: string, sortBy: string, searchText?: string|null): Promise<TPaginationResult<AppUserModel>> {
    const options: any = {
      where: {
        deletedAt: {
          [Op.eq]: null
        }
      },
      order: [[sortBy, sortOrder]]
    }

    if(searchText)
      options.where = { ...options.where, name: { [Op.iLike]: `%${searchText}%` }}

    return await paginatedResults(AppUserModel, options, page, limit) as TPaginationResult<AppUserModel>; // use your actual pagination logic
  }

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
  
  async getAllLanguagesWithOptions(select: string[]|null = null): Promise<TAppUser[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await AppUserModel.findAll(options));
  }

  async create(data: TStoreAppUser, transaction?: Transaction): Promise<TAppUser> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await AppUserModel.create(data, options) as unknown as TAppUser;
  }

  async update(data: TUpdateAppUserData, id: string, transaction?: Transaction): Promise<TAppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AppUserModel.update(data, options)) as unknown as TAppUser;
  }

  async delete(id: string, transaction?: Transaction): Promise<TAppUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return await AppUserModel.update({ deletedAt: datetimeYMDHis() }, options) as unknown as TAppUser;
  }

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
