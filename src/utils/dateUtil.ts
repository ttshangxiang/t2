import * as moment from 'moment';

// 现在的时间
export function now (): string {
  return moment().format('YYYY/MM/DD HH:mm:ss');
}

// 今天的日期
export function today (): string {
  return moment().format('YYYYMMDD');
}