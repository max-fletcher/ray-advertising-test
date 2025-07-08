import ShortUniqueId from 'short-unique-id';

const generateId = () => {
  const uId = new ShortUniqueId({ length: 10 });
  const id = uId.rnd();
  return id;
};
