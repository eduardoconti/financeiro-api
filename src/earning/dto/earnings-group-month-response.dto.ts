import { Earning } from '@earning/entity';

export class EarningsGroupMonthDTO {
  month: number;
  data: Earning[];
  total: number;
  totalPayed: number;
  totalOpen: number;
  quantity: number;

  constructor(
    month: number,
    data: Earning[],
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
  }: EarningsGroupMonthDTO): EarningsGroupMonthDTO => {
    return new EarningsGroupMonthDTO(
      month,
      data,
      total,
      totalPayed,
      totalOpen,
      quantity,
    );
  };
}
