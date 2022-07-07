import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

import { GeneralGraphicDataDTO } from './general-graphic-data.dto';
import { GeneralGraphicResponseDataDTO } from './general-graphic-response-data.dto';

export class GeneralDTO {
  @ApiResponseProperty({
    type: GeneralGraphicDataDTO,
  })
  earnings: GeneralGraphicDataDTO;
  @ApiResponseProperty({
    type: GeneralGraphicDataDTO,
  })
  expenses: GeneralGraphicDataDTO;

  constructor(
    earnings: GeneralGraphicDataDTO,
    expenses: GeneralGraphicDataDTO,
  ) {
    this.earnings = earnings;
    this.expenses = expenses;
  }
}
export class GeneralGraphicResponseDTO {
  @ApiProperty({
    type: GeneralDTO,
  })
  public geral: GeneralDTO;
  @ApiProperty({
    type: [GeneralGraphicResponseDataDTO],
  })
  public months: GeneralGraphicResponseDataDTO[] = [];

  constructor() {
    this.geral = new GeneralDTO(
      GeneralGraphicDataDTO.build({
        quantity: 0,
        total: 0,
        totalOpen: 0,
        totalPayed: 0,
      }),
      GeneralGraphicDataDTO.build({
        quantity: 0,
        total: 0,
        totalOpen: 0,
        totalPayed: 0,
      }),
    );
  }
  setGeral(geral: GeneralDTO) {
    this.geral = geral;
  }

  setData(months: GeneralGraphicResponseDataDTO[]) {
    this.months = months;
  }
}
