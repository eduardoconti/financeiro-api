import {
  GeneralGraphicResponseDTO,
  UnplannedExpensesResponseDTO,
} from '@graphic/dto/general-graphic';

export interface IGraphicService {
  generalGraphic(userId: string): Promise<GeneralGraphicResponseDTO>;
  unplannedExpenses(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<UnplannedExpensesResponseDTO>;
}
