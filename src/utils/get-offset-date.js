export const getOffsetDate = (date, offset) => {
  const dateInMilliseconds = date.getTime();

  return new Date(dateInMilliseconds - offset);
};
