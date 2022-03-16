import { Inject } from '@nestjs/common';

import { ReceitasDTO } from '@earning/dto';
import { Earning } from '@earning/entity';
import { IEarningRepository } from '@earning/repository';

import { TYPES } from '@config/dependency-injection';

import { IInsertEarningService } from './insert-earning.service.interface';

export class InsertEarningService implements IInsertEarningService {
  constructor(
    @Inject(TYPES.EarningRepository)
    private readonly earningRepository: IEarningRepository,
  ) {}

  async insert(earning: ReceitasDTO, userId: string): Promise<Earning> {
    const entity = Earning.build({ ...earning, userId });

    return await this.earningRepository.insert(entity);
  }
}
