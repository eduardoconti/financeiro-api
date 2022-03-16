import { Inject } from '@nestjs/common';

import { EarningDeleteResponseDTO } from '@receitas/dto';
import {
  DeleteEarningException,
  EarningNotFoundException,
} from '@receitas/exceptions';
import { IEarningRepository } from '@receitas/repository';

import { TYPES } from '@config/dependency-injection';

import { IDeleteEarningService } from './delete-earning.service.interface';

export class DeleteEarningService implements IDeleteEarningService {
  constructor(
    @Inject(TYPES.EarningRepository)
    private readonly earningRepository: IEarningRepository,
  ) {}

  async delete(id: number, userId: string): Promise<EarningDeleteResponseDTO> {
    const earning = await this.earningRepository
      .findOneByParams({ id, userId })
      .catch((e) => {
        throw new DeleteEarningException(e, { id, userId });
      });

    if (!earning) {
      throw new EarningNotFoundException(undefined, { id, userId });
    }
    return await this.earningRepository.delete(id);
  }
}
