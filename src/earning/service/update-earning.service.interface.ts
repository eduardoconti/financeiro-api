import { ReceitasDTO, EarningPatchFlagPayedDTO } from '@earning/dto';
import { Earning } from '@earning/entity';

export interface IUpdateEarningService {
  update(
    id: number,
    userId: string,
    earning: Partial<ReceitasDTO>,
  ): Promise<Earning>;

  updateFlagPayed(
    id: number,
    userId: string,
    patchData: EarningPatchFlagPayedDTO,
  ): Promise<Earning>;
}
