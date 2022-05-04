import { EarningDeleteResponseDTO } from '@earning/dto';

export interface IDeleteEarningService {
  delete(id: number, userId: string): Promise<EarningDeleteResponseDTO>;
}
