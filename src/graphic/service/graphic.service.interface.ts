import { GeneralGraphicResponseDTO } from '@graphic/dto/general-graphic';

export interface IGraphicService {
  generalGraphic(
    userId: string,
    pago?: boolean,
  ): Promise<GeneralGraphicResponseDTO>;
}
