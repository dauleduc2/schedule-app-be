export const getDateFromString = (date: string): Date => {
    const [month, day, year] = date.split('/');
    return new Date(+year, +month - 1, +day);
};
