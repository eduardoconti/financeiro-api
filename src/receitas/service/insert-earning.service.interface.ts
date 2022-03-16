import { ReceitasDTO } from '@receitas/dto';
import { Receitas } from '@receitas/entity';

export interface IInsertEarningService {
  insert(earning: ReceitasDTO, userId: string): Promise<Receitas>;
}
