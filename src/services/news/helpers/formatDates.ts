export const formatDate = (param: string | Date): string => {
  const date = new Date(param);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day}, ${year}`;
}

// Convierte fecha ISO 8601 a formato YYYY-MM-DD para Guardian API
export const formatDateForGuardian = (isoDate: string): string => {
  return isoDate.split('T')[0];
};