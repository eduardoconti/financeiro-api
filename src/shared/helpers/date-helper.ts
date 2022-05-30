import * as moment from 'moment';
moment().locale('pb-br');
export class DateHelper {
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

  static addMonth(months: number, date?: string | Date) {
    return moment(date).add(months, 'M').toDate();
  }
}
