export const transformUnixTimestampIntoDate = (timestamp) => {
  return new Date(timestamp * 1000);
};
