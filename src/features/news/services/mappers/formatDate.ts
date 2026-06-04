export const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    return `${month}, ${date.getDate()}, ${date.getFullYear()}`;
};
