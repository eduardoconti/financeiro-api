import { ReceitasDTO } from '@earning/dto';
import { Receitas } from '@earning/entity';

export interface IInsertEarningService {
  insert(earning: ReceitasDTO, userId: string): Promise<Receitas>;
}
