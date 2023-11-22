import moment from 'moment';

export const getRecentDay = (n: number, endDate: string) => {
  return moment(new Date(endDate)).subtract(n, 'day').format('YYYY-MM-DD');
};
export const getRecentMonth = (n: number, endDate: string) => {
  return moment(new Date(endDate)).subtract(n, 'months').format('YYYY-MM-DD');
};
