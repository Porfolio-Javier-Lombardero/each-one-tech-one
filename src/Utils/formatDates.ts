export const formatDate = (param: string | Date): string => {
  const date = new Date(param);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day}, ${year}`;
}