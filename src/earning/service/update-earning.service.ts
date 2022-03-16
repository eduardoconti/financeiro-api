import { Injectable, Inject } from '@nestjs/common';
import { EarningPatchFlagPayedDTO, ReceitasDTO } from '@earning/dto';
import { Receitas } from '@earning/entity';
import { EarningNotFoundException } from '@earning/exceptions';
import { IEarningRepository } from '@earning/repository';

import { TYPES } from '@config/dependency-injection';

import { IUpdateEarningService } from './update-earning.service.interface';

@Injectable()
export class UpdateEarningService implements IUpdateEarningService {
  constructor(
    @Inject(TYPES.EarningRepository)
    private earningRepository: IEarningRepository,
  ) {}

  async update(
    id: number,
    userId: string,
    earning: Partial<ReceitasDTO>,
  ): Promise<Receitas> {
    const findEarning = await this.earningRepository.findOneByParams({
      id,
      userId,
    });
    if (!findEarning) {
      throw new EarningNotFoundException();
    }
    return await this.earningRepository.update(id, earning);
  }

  async updateFlagPayed(
    id: number,
    userId: string,
    patchData: EarningPatchFlagPayedDTO,
  ): Promise<Receitas> {
    const earning = await this.earningRepository.findOneByParams({
      id,
      userId,
    });
    if (!earning) {
      throw new EarningNotFoundException();
    }
    if (earning.pago !== patchData.pago) {
      await this.earningRepository.update(id, patchData);
      earning.pago = patchData.pago;
    }
    return earning;
  }
}