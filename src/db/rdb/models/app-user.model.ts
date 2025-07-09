// import { UserClient } from '../../clients/postgres.client';
// import {
//   Model,
//   DataTypes,
//   InferAttributes,
//   InferCreationAttributes,
//   CreationOptional,
// } from 'sequelize';

// const sequelize = UserClient.getInstance();

// class AppUserModel extends Model<
//   InferAttributes<AppUserModel>,
//   InferCreationAttributes<AppUserModel>
// > {
//   declare id: string;
//   declare email: CreationOptional<string>;
//   declare password: CreationOptional<string>;
//   declare firstName: CreationOptional<string | null>;
//   declare lastName: CreationOptional<string | null>;
//   declare avatarUrl: CreationOptional<string | null>;
//   declare deletedAt: CreationOptional<string | null>;
//   declare deletedBy: CreationOptional<string | null>;
// }

// AppUserModel.init(
//   {
//     id: {
//       type: DataTypes.STRING,
//       primaryKey: true,
//     },
//     email: {
//       type: DataTypes.STRING
//     },
//     password: {
//       type: DataTypes.STRING
//     },
//     firstName: {
//       type: DataTypes.STRING,
//       defaultValue: null,
//     },
//     lastName: {
//       type: DataTypes.STRING,
//       defaultValue: null,
//     },
//     avatarUrl: {
//       type: DataTypes.STRING,
//     },
//     deletedAt: {
//       type: DataTypes.DATE,
//       defaultValue: null,
//     },
//     deletedBy: {
//       type: DataTypes.STRING,
//       defaultValue: null,
//     },
//   },
//   {
//     tableName: 'app_users',
//     sequelize,
//     timestamps: true,
//   },
// );

// export { AppUserModel };
