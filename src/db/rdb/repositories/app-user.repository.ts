import { Op, Transaction } from 'sequelize';
import { TiersModel, UserBalanceModel, AppUserModel, UserTierStatusModel, CurrencyModel } from '../models';
import { SocialAuthProviders, User, UserUpdate } from '../../../types/app.user.type';
import { datetimeYMDHis } from '../../../utils/datetime.utils';
import { getEnvVar } from '../../../utils/common.utils';
import { CustomException } from '../../../errors/CustomException.error';
import { updateUserOptions } from 'types/repository.type';
import { UserBalanceType } from '../../../types/common-models.type';
import { AppUserTierStatus } from '../../../constants/enums';
export class AppUserRepository {
  constructor() {}
  async createUser(
    user: User,
    userBalance: UserBalanceType,
    transaction: Transaction,
  ): Promise<User> {
    try {
      const createdUser = await AppUserModel.create(user, { transaction: transaction });
      await UserBalanceModel.create(userBalance, { transaction: transaction });
      return createdUser;
    } catch (e) {
      console.log('Custom exception: ', e);
      throw new CustomException('Something went wrong! Please try again.', 500);
    }
  }

  async findUserById(id: string): Promise<User> {
    return (await AppUserModel.findOne({
      where: {
        id: id,
      },
    })) as unknown as User;
  }

  async findUserByIds(ids: string[]): Promise<User[]> {
    return (await AppUserModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })) as unknown as User[];
  }

  async userExistsById(id: string): Promise<number> {
    return (await AppUserModel.count({
      where: {
        id: id,
      },
    }));
  }

  async userIsGuest(id: string): Promise<number> {
    return (await AppUserModel.count({
      where: {
        id: id,
        guest: true
      },
    }));
  }

  async userExistsByUsername(username: string, id: string|null = null): Promise<number> {
    const options: {where: { username: string, id?: object }} = {
      where: {
        username: username,
      },
    }
    if(id)
      options.where.id ={ [Op.ne]: id }

    return (await AppUserModel.count(options));
  }

  async findUserByEmail(email: string): Promise<User> {
    return (await AppUserModel.findOne({
      where: {
        email: email,
      },
    })) as unknown as User;
  }

  async userExistsByEmail(email: string, id: string|null = null): Promise<User> {
    const options: {where: { email: string, id?: object }} = {
      where: {
        email: email,
      },
    }
    if(id)
      options.where.id ={ [Op.ne]: id }

    return (await AppUserModel.count(options) as unknown as User);
  }

  async findUserByPhone(phone: string, id: string|null = null): Promise<User> {
    const options: {where: { phone: string, id?: object }} = {
      where: {
        phone: phone,
      },
    }
    if(id)
      options.where.id ={ [Op.ne]: id }

    return (await AppUserModel.findOne(options) as unknown as User);
  }

  async userExistsByPhone(phone: string, id: string|null = null): Promise<User> {
    const options: {where: { phone: string, id?: object }} = {
      where: {
        phone: phone,
      },
    }
    if(id)
      options.where.id ={ [Op.ne]: id }

    return (await AppUserModel.count(options) as unknown as User);
  }

  async userExistsByWhatsapp(whatsapp_no: string, id: string|null = null): Promise<User> {
    const options: {where: { whatsapp_no: string, id?: object }} = {
      where: {
        whatsapp_no: whatsapp_no,
      },
    }
    if(id)
      options.where.id ={ [Op.ne]: id }

    return (await AppUserModel.count(options) as unknown as User);
  }

  async nullifyUserOtp(id: string): Promise<User> {
    return (await AppUserModel.update(
      {
        otp: null,
        otp_expires_at: null,
      },
      {
        where: {
          id: id,
        },
      },
    )) as unknown as User;
  }

  async setOtp(id: string, otp: string): Promise<User> {
    const otp_validity = Number(getEnvVar('OTP_EXPIRY'));
    return (await AppUserModel.update(
      {
        otp: otp,
        otp_expires_at: datetimeYMDHis(null, 'mins', otp_validity),
      },
      {
        where: {
          id: id,
        },
      },
    )) as unknown as User;
  }

  async getUserProfile(id: string): Promise<User> {
    const currentDate = datetimeYMDHis();

    return (await AppUserModel.findOne(
      {
        where: {
          id: id,
        },
        attributes: ['id', 'name', 'username', 'email', 'phone', 'whatsapp_no', 'country', 'currency_id', 'profile_image_url', 'avatar_url', 'status', 'verified', 'guest', 'createdAt'],
        include: [
          {
              model: UserBalanceModel,
              as: 'app_user_balance',
              attributes: ['cash_balance', 'coin_balance'],
          },
          {
            model: UserTierStatusModel,
            as: 'tier_statuses',
            required: false,
            where: {
              end_date: {
                [Op.gt]: currentDate
              },
              status: {
                [Op.ne]: AppUserTierStatus.CANCELLED
              },
            },
            attributes: ['id', 'createdAt'],
            include: [
              {
                model: TiersModel,
                as: 'tier',
                attributes: ['id', 'name'],
              },
            ]
          },
          {
            model: CurrencyModel,
            as: 'currency',
            required: true,
            attributes: ['id', 'short_code'],
          },
        ],
        order: [['tier_statuses', 'tier', 'order', 'DESC']],
      })) as unknown as User;
  }

  async findByProvider(username: string): Promise<User> {
    return (await AppUserModel.findOne({
      where: {
        username: username,
      },
    })) as unknown as User;
  }

  async deleteById(id: string): Promise<User> {
    return (await AppUserModel.destroy({
      where: {
        id: id,
      },
    })) as unknown as User;
  }

  async findUserByProviderID(provider: SocialAuthProviders, provider_id: string): Promise<User> {
    return (await AppUserModel.findOne({
      where: {
        [provider + '_id']: provider_id,
      },
    })) as unknown as User;
  }

  async userExistsByProviderID(provider: SocialAuthProviders, provider_id: string): Promise<User> {
    return (await AppUserModel.count({
      where: {
        [provider + '_id']: provider_id,
      },
    })) as unknown as User;
  }

  async updateUser(data: UserUpdate, id: string, transaction: Transaction|null = null): Promise<User> {
    const options: updateUserOptions = {
      where: {
        id: id,
      }
    }

    if(transaction)
      options.transaction = transaction

    return (await AppUserModel.update(data, options)) as unknown as User;
  }

  async customerIdSet(stripe_customer_id: string, id: string): Promise<User> {
    const options: {where: { id: string, stripe_customer_id: string }} = {
      where: {
        id: id,
        stripe_customer_id: stripe_customer_id,
      },
    }
    return (await AppUserModel.count(options) as unknown as User);
  }


  async getAllAppUsers(): Promise<User[]> {
    return (await AppUserModel.findAll({
      order: [['createdAt', 'DESC']],
    })) as unknown as User[];
  }
}
