import { Despesas } from '@expense/entity';

export class ExpensesGroupMonthDTO {
  month: number;
  data: Despesas[];
  total: number;
  totalPayed: number;
  totalOpen: number;
  quantity: number;

  constructor(
    month: number,
    data: Despesas[],
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

  static build = ({
    month,
    total,
    totalPayed,
    totalOpen,
    quantity,
    data,
  }: ExpensesGroupMonthDTO): ExpensesGroupMonthDTO => {
    return new ExpensesGroupMonthDTO(
      month,
      data,
      total,
      totalPayed,
      totalOpen,
      quantity,
    );
  };
}
