import { Transform } from 'class-transformer';

export class GetTotalTransferenceResponseDTO {
  @Transform(({ value }) => Math.round(value * 100) / 100)
  readonly total: number;
  @Transform(({ value }) => Math.round(value * 100) / 100)
  readonly totalOpen: number;
  @Transform(({ value }) => Math.round(value * 100) / 100)
  readonly totalPayed: number;

  private constructor(total: number, totalOpen: number, totalPayed: number) {
    this.total = total;
    this.totalOpen = totalOpen;
    this.totalPayed = totalPayed;
  }

  static build = ({
    total,
    totalOpen,
    totalPayed,
  }: GetTotalTransferenceResponseDTO): GetTotalTransferenceResponseDTO => {
    return new GetTotalTransferenceResponseDTO(total, totalOpen, totalPayed);
  };
}
