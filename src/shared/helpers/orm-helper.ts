import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

import { DateHelper } from './date-helper';

export class OrmHelper {
  static buildDateWhere(
    start?: string | Date,
    end?: string | Date,
  ): FindOperator<Date> | undefined {
    if (!start && !end) {
      return;
    }
    if (start && end) {
      return Between(DateHelper.date(start), DateHelper.date(end));
    }
    if (start) {
      return MoreThanOrEqual(DateHelper.date(start));
    }
    if (end) {
      return LessThanOrEqual(DateHelper.date(end));
    }
    return
  }
}
