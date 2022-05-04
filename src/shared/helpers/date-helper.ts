import * as moment from 'moment';
export class DateHelper {
  constructor() {
    moment().locale('pb-br');
  }

  static dateIso8601(dateString?: string): string {
    return moment(dateString).toISOString();
  }

  static dateNow() {
    return moment().toDate();
  }

  static dateNowTimeZone(timeZone?: number): Date {
    return moment().add(timeZone, 'hours').toDate();
  }

  static date(date: string | Date): Date {
    return moment(date).toDate();
  }
}
