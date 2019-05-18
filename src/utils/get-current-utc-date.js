export const getCurrentUTCDate = () => {
  const currentUTCDateAsString = new Date().toISOString();

  return new Date(currentUTCDateAsString);
};
