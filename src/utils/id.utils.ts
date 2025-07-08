// import ShortUniqueId from 'short-unique-id';
import { v7 as uuidv7 } from 'uuid';

export const generateId = () => {
  return uuidv7();
};

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
