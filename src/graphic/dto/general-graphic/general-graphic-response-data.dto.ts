import { ApiResponseProperty } from '@nestjs/swagger';

import { GeneralGraphicDataDTO } from './general-graphic-data.dto';

export class GeneralGraphicResponseDataDTO {
  @ApiResponseProperty({
    type: String,
    example: '2022-jun',
  })
  month: string;
  @ApiResponseProperty({
    type: GeneralGraphicDataDTO,
  })
  earnings: GeneralGraphicDataDTO;
  @ApiResponseProperty({
    type: GeneralGraphicDataDTO,
  })
  expenses: GeneralGraphicDataDTO;
  @ApiResponseProperty({
    type: Number,
  })
  ballance: number;
  @ApiResponseProperty({
    type: Number,
  })
  totalBallance: number;

  private constructor(
    month: string,
    earnings: GeneralGraphicDataDTO,
    expenses: GeneralGraphicDataDTO,
    ballance: number,
    totalBallance: number,
  ) {
    this.month = month;
    this.earnings = earnings;
    this.expenses = expenses;
    this.ballance = ballance;
    this.totalBallance = totalBallance;
  }

  static build({
    month,
    earnings,
    expenses,
    ballance,
    totalBallance,
  }: GeneralGraphicResponseDataDTO): GeneralGraphicResponseDataDTO {
    return new GeneralGraphicResponseDataDTO(
      month,
      earnings,
      expenses,
      ballance,
      totalBallance,
    );
  }
}
