import { EarningDeleteResponseDTO } from '@receitas/dto';

export interface IDeleteEarningService {
  delete(id: number, userId: string): Promise<EarningDeleteResponseDTO>;
}
