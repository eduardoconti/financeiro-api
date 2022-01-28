export class EarningsGroupMonthDTO<T> {
  month: number;
  total: number;
  totalPayed: number;
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
