import { ApiResponseProperty } from '@nestjs/swagger';

export class GeneralUnplannedDTO {
  @ApiResponseProperty({
    type: Number,
  })
  quantity = 0;
  @ApiResponseProperty({
    type: Number,
  })
  total = 0;
  @ApiResponseProperty({
    type: Number,
  })
  totalOpen = 0;
  @ApiResponseProperty({
    type: Number,
  })
  totalPayed = 0;

  public sum(partial: Partial<GeneralUnplannedDTO>) {
    this.quantity += partial.quantity ?? 0;
    this.total += partial.total ?? 0;
    this.totalOpen += partial.totalOpen ?? 0;
    this.totalPayed += partial.totalPayed ?? 0;
  }
}
export class MonthDTO {
  @ApiResponseProperty({
    type: String,
    example: '2022-jun',
  })
  month = '';
  @ApiResponseProperty({
    type: Number,
  })
  quantity = 0;
  @ApiResponseProperty({
    type: Number,
  })
  total = 0;
  @ApiResponseProperty({
    type: Number,
  })
  totalOpen = 0;
  @ApiResponseProperty({
    type: Number,
  })
  totalPayed = 0;
  constructor(partial: Partial<MonthDTO>) {
    Object.assign(this, partial);
  }

  static build(partial: Partial<MonthDTO>) {
    return new MonthDTO(partial);
  }
}

export class UnplannedExpensesResponseDTO {
  @ApiResponseProperty({
    type: GeneralUnplannedDTO,
  })
  public geral!: GeneralUnplannedDTO;
  @ApiResponseProperty({
    type: [MonthDTO],
  })
  public months: MonthDTO[] = [];

  public addMonth(month: MonthDTO) {
    this.months.push(month);
  }

  public setGeral(geral: GeneralUnplannedDTO) {
    this.geral = geral;
  }
}
