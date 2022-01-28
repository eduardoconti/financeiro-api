import { Transform } from 'class-transformer';

import { GeneralGraphicDataDTO } from '.';

export class GeneralGraphicResponseDataDTO {
  month: string;
  earnings: GeneralGraphicDataDTO;
  expenses: GeneralGraphicDataDTO;
  @Transform(({ value }) => Math.round(value * 100) / 100)
  ballance: number;
  @Transform(({ value }) => Math.round(value * 100) / 100)
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
