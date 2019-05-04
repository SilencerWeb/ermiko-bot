export const getDateAsString = (date = new Date()) => {
  const year = date.getUTCFullYear();

  let month = date.getUTCMonth() + 1;
  if (month < 10) month = `0${month}`;

  let day = date.getUTCDate();
  if (day < 10) day = `0${day}`;

  return `${year}-${month}-${day}`;
};
