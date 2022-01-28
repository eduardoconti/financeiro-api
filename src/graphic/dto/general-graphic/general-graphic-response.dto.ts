import { GeneralGraphicDataDTO } from '.';
import { GeneralGraphicResponseDataDTO } from './general-graphic-response-data.dto';

export class GeneralGraphicResponseDTO {
  public geral: GeneralDTO;
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

export class GeneralDTO {
  earnings: GeneralGraphicDataDTO;
  expenses: GeneralGraphicDataDTO;

  constructor(
    earnings: GeneralGraphicDataDTO,
    expenses: GeneralGraphicDataDTO,
  ) {
    this.earnings = earnings;
    this.expenses = expenses;
  }
}
