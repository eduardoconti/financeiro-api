import * as moment from 'moment';

import { DateHelper } from './date-helper';

jest.mock('moment', () => {
  const mMoment = {
    toISOString: () => '2020-05-26T18:59:18.026Z',
    locale: () => 'pb-br',
    toDate: () => new Date('2022-05-26T18:59:18.026Z'),
    add: () => mMoment,
  };
  return jest.fn(() => mMoment);
});
describe('DateHelper', () => {
  it('should be defined', () => {
    expect(new DateHelper()).toBeDefined();
  });
  it('should be able to dateIso8601', () => {
    const date = DateHelper.dateIso8601();
    expect(date).toBeDefined();
    expect(date).toEqual(moment().toISOString());
  });
  it('should be able to dateNow', () => {
    const date = DateHelper.dateNow();
    expect(date).toBeDefined();
    expect(date).toEqual(moment().toDate());
    expect(date).toBeInstanceOf(Date);
  });
  it('should be able to dateNowTimeZone', () => {
    const date = DateHelper.dateNowTimeZone();
    expect(date).toBeDefined();
    expect(date).toEqual(moment().add(3, 'hours').toDate());
  });
  it('should be able to date', () => {
    const date = DateHelper.date(new Date());
    expect(date).toBeDefined();
    expect(date).toEqual(moment(new Date()).toDate());
  });
  it('should be able to addMonth', () => {
    const date = DateHelper.addMonth(1, new Date());
    expect(date).toBeDefined();
    expect(date).toEqual(moment(new Date()).add(1, 'M').toDate());
  });
});
