import { ApiResponseProperty } from '@nestjs/swagger';

export class GeneralGraphicDataDTO {
  @ApiResponseProperty({
    type: Number,
  })
  quantity: number;
  @ApiResponseProperty({
    type: Number,
  })
  total: number;
  @ApiResponseProperty({
    type: Number,
  })
  totalOpen: number;
  @ApiResponseProperty({
    type: Number,
  })
  totalPayed: number;

  private constructor(
    quantity: number,
    total: number,
    totalOpen: number,
    totalPayed: number,
  ) {
    this.quantity = quantity;
    this.total = total;
    this.totalOpen = totalOpen;
    this.totalPayed = totalPayed;
  }

  static build({
    quantity,
    total,
    totalOpen,
    totalPayed,
  }: GeneralGraphicDataDTO): GeneralGraphicDataDTO {
    return new GeneralGraphicDataDTO(quantity, total, totalOpen, totalPayed);
  }
}
