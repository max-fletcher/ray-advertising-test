import { UserClient } from '../../clients/postgres.client';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { AppUserNotificationOptions, AppUserTierStatus } from '../../../constants/enums';
import { UserProviders } from '../../../types/app.user.type';
const sequelize = UserClient.getInstance();

class AppUserModel extends Model<
  InferAttributes<AppUserModel>,
  InferCreationAttributes<AppUserModel>
> {
  declare id: string;
  declare name: string|null;
  declare username: string|null;
  declare email: string|null;
  declare password: string|null;
  declare phone: string|null;
  declare whatsapp_no: string|null;
  declare otp: string|null;
  declare otp_expires_at: string|null;
  declare providers: UserProviders;
  declare google_id: string | null;
  declare facebook_id: string | null;
  declare apple_id: string | null;
  declare profile_image_url: string | null;
  declare avatar_url: string | null;
  declare country: string | null;
  declare currency_id: string | null;
  declare status: string;
  declare verified: boolean;
  declare guest: boolean;
  declare stripe_customer_id: string|null;
  declare notifications: string;
  declare disable_notifications_till: string|null;
}

AppUserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    whatsapp_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    otp_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    providers: {
      type: DataTypes.JSON,
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apple_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        AppUserTierStatus.ACTIVE,
        AppUserTierStatus.UPGRADED,
        AppUserTierStatus.DOWNGRADED,
        AppUserTierStatus.CANCELLED,
      ),
      allowNull: true,
    },
    guest: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notifications: {
      type: DataTypes.ENUM(
        AppUserNotificationOptions.ON,
        AppUserNotificationOptions.OFF,
        AppUserNotificationOptions['1HR'],
        AppUserNotificationOptions['8HR'],
        AppUserNotificationOptions['24HR'],
      ),
      defaultValue: AppUserNotificationOptions.ON,
    },
    disable_notifications_till: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: true,
  },
);

export { AppUserModel };
