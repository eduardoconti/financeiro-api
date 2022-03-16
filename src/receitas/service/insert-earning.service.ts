import { Inject } from '@nestjs/common';

import { ReceitasDTO } from '@receitas/dto';
import { Receitas } from '@receitas/entity';
import { IEarningRepository } from '@receitas/repository';

import { TYPES } from '@config/dependency-injection';

import { IInsertEarningService } from './insert-earning.service.interface';

export class InsertEarningService implements IInsertEarningService {
  constructor(
    @Inject(TYPES.EarningRepository)
    private readonly earningRepository: IEarningRepository,
  ) {}

  async insert(earning: ReceitasDTO, userId: string): Promise<Receitas> {
    const entity = Receitas.build({ ...earning, userId });

    return await this.earningRepository.insert(entity);
  }
}
