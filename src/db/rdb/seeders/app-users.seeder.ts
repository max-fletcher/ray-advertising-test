import { CurrencyData } from 'types/currency.type';
import { hashPassword } from '../../../utils/password.utils';

const seedAppUsers = async () => {
  try {
    const appUsers = [
      {
        id: 'usr_56913465891340',
        username: 'User 1',
        email: 'user1@mail.com',
        password: await hashPassword('password'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'usr_56913465891350',
        username: 'User 2',
        email: 'user2@mail.com',
        password: await hashPassword('password'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'usr_56913465891360',
        username: 'User 3',
        email: 'user3@mail.com',
        password: await hashPassword('password'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Run DB Query
    console.log('App users have been seeded successfully');
  } catch (error) {
    console.error('Error seeding app users:', error);
  }
};

export { seedAppUsers };
