import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { DateHelper } from './date-helper';
import { OrmHelper } from './orm-helper';

describe('OrmHelper', () => {
  it('should be defined', () => {
    expect(OrmHelper).toBeDefined();
  });
  it('should be able to buildDateWhere', () => {
    const start = '2020-01-01';
    const end = '2020-01-02';
    const dateWhere = OrmHelper.buildDateWhere(start, end);
    expect(dateWhere).toBeDefined();
    expect(dateWhere).toEqual(
      Between(DateHelper.date(start), DateHelper.date(end)),
    );
  });
  it('should be able to buildDateWhere without start date', () => {
    const start = undefined;
    const end = '2020-01-02';
    const dateWhere = OrmHelper.buildDateWhere(start, end);
    expect(dateWhere).toBeDefined();
    expect(dateWhere).toEqual(LessThanOrEqual(DateHelper.date(end)));
  });
  it('should be able to buildDateWhere without end date', () => {
    const start = '2020-01-01';
    const end = undefined;
    const dateWhere = OrmHelper.buildDateWhere(start, end);
    expect(dateWhere).toBeDefined();
    expect(dateWhere).toEqual(MoreThanOrEqual(DateHelper.date(start)));
  });

  it('should be able to buildDateWhere without params', () => {
    const start = undefined;
    const end = undefined;
    const dateWhere = OrmHelper.buildDateWhere(start, end);
    expect(dateWhere).not.toBeDefined();
  });
});
