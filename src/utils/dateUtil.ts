import * as moment from 'moment';

// 现在的时间
export function now (): string {
  return moment().format('YYYY/MM/DDTHH:mm:ss');
}