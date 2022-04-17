import { GeneralGraphicResponseDTO } from '@graphic/dto/general-graphic';

export interface IGraphicService {
  generalGraphic(userId: string): Promise<GeneralGraphicResponseDTO>;
}
