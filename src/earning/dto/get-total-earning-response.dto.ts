export class GetTotalEarningResponseDTO {
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
  }: any): GetTotalEarningResponseDTO => {
    return new GetTotalEarningResponseDTO(total, totalOpen, totalPayed);
  };
}
