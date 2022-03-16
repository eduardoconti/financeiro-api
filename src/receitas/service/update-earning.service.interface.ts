import { ReceitasDTO, EarningPatchFlagPayedDTO } from '@receitas/dto';
import { Receitas } from '@receitas/entity';

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
