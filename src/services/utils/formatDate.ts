export const formatDate = (param: string | Date): string => {
  const date = new Date(param);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day}, ${year}`;
}

export const today = (): string => {
  const today = new Date();
  today.setUTCDate(today.getUTCDate() - 5);
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const yesterday = (params: Date | string): string => {
  const date = typeof params === 'string' ? new Date(params) : new Date(params);
  date.setUTCDate(date.getUTCDate() - 1);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}