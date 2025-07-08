import { hashPassword } from '../../../utils/password.utils';

const seedAppUsers = async () => {
  try {
    const appUsers = [
      {
        id: 'usr_56913465891340',
        email: 'user1@mail.com',
        password: await hashPassword('password'),
        firstName: 'User',
        lastName: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'usr_56913465891350',
        email: 'user2@mail.com',
        password: await hashPassword('password'),
        firstName: 'User',
        lastName: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'usr_56913465891360',
        email: 'user3@mail.com',
        password: await hashPassword('password'),
        firstName: 'User',
        lastName: '3',
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
