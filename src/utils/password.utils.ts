import bcrypt from 'bcryptjs';

/**
 * Hashes a plaintext password.
 * @param password The plaintext password to hash.
 * @returns A promise that resolves with the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Adjust salt rounds as needed; more rounds are more secure but slower
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plaintext password with a hashed password to see if they match.
 * @param password The plaintext password.
 * @param hashedPassword The hashed password.
 * @returns A promise that resolves with a boolean indicating if the passwords match.
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
