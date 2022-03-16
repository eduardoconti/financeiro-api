import { ReceitasDTO, EarningPatchFlagPayedDTO } from '@earning/dto';
import { Receitas } from '@earning/entity';

export interface IUpdateEarningService {
  update(
    id: number,
    userId: string,
    earning: Partial<ReceitasDTO>,
  ): Promise<Receitas>;

  updateFlagPayed(
    id: number,
    userId: string,
    patchData: EarningPatchFlagPayedDTO,
  ): Promise<Receitas>;
}
