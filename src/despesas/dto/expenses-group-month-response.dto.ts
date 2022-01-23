import { Transform } from 'class-transformer';

export class ExpensesGroupMonthDTO<T> {
  month: number;
  @Transform(({ value }) => Math.round(value * 100) / 100)
  total: number;
  @Transform(({ value }) => Math.round(value * 100) / 100)
  totalPayed: number;
  @Transform(({ value }) => Math.round(value * 100) / 100)
  totalOpen: number;
  quantity: number;
  data: T[];

  constructor(
    month: number,
    total: number,
    totalPayed: number,
    totalOpen: number,
    quantity: number,
    data: T[],
  ) {
    this.month = month;
    this.total = total;
    this.totalOpen = totalOpen;
    this.totalPayed = totalPayed;
    this.quantity = quantity;
    this.data = data;
  }
}
