import * as moment from 'moment';

export const defaults = {
  DATE_FORMAT: 'YYYY-MM-DD',
  COLOR: 'primary',
  WEEKS_FORMAT: moment.weekdaysShort() || ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  MONTH_FORMAT: moment.monthsShort() || [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ],
};

export const pickModes = {
  SINGLE: 'single',
  RANGE: 'range',
  MULTI: 'multi',
};
