export class GetTotalExpenseResponseDTO {
  readonly total: number;
  readonly totalOpen: number;
  readonly totalPayed: number;

  private constructor(total: string, totalOpen: string, totalPayed: string) {
    this.total = parseInt(total);
    this.totalOpen = parseInt(totalOpen);
    this.totalPayed = parseInt(totalPayed);
  }

  static build = ({
    total,
    totalOpen,
    totalPayed,
  }: any): GetTotalExpenseResponseDTO => {
    return new GetTotalExpenseResponseDTO(total, totalOpen, totalPayed);
  };
}
