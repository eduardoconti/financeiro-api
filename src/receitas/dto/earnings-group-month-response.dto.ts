import { Receitas } from '@receitas/entity';

export class EarningsGroupMonthDTO {
  month: number;
  total: number;
  totalPayed: number;
  totalOpen: number;
  quantity: number;
  data: Receitas[];

  constructor(
    month: number,
    data: Receitas[],
    total = 0,
    totalPayed = 0,
    totalOpen = 0,
    quantity = 0,
  ) {
    this.month = month;
    this.total = total;
    this.totalOpen = totalOpen;
    this.totalPayed = totalPayed;
    this.quantity = quantity;
    this.data = data;
  }
}
