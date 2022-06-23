import { Transferencias } from '@transference/entity';

export class TransferenceGroupMonthDTO {
  month: number;
  data: Transferencias[];
  total: number;
  totalPayed: number;
  totalOpen: number;
  quantity: number;

  constructor(
    month: number,
    data: Transferencias[],
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
  }: TransferenceGroupMonthDTO): TransferenceGroupMonthDTO => {
    return new TransferenceGroupMonthDTO(
      month,
      data,
      total,
      totalPayed,
      totalOpen,
      quantity,
    );
  };
}
