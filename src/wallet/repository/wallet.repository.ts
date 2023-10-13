import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CarteirasDeleteResponseDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';
import {
  DeleteWalletException,
  FindWalletException,
  ForbiddenWalletException,
  InsertWalletException,
  UpdateWalletException,
  WalletNotFoundException,
} from '@wallet/exception';

import { IWalletRepository } from './wallet.repository.interface';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Carteiras)
    private readonly repository: Repository<Carteiras>,
  ) {}

  async insert(walletRequest: Carteiras): Promise<Carteiras> {
    try {
      const wallet = this.repository.create(walletRequest);
      return await this.repository.save(wallet);
    } catch (error) {
      throw new InsertWalletException(error, walletRequest);
    }
  }

  async update(walletEntity: Carteiras): Promise<Carteiras> {
    try {
      const wallet = this.repository.create(walletEntity);
      return await this.repository.save(wallet);
    } catch (error) {
      throw new UpdateWalletException(error);
    }
  }

  async findById(id: number): Promise<Carteiras> {
    const wallet = await this.repository
      .findOne({
        relations: ['user'],
        where: { id: id },
      })
      .catch((error) => {
        throw new FindWalletException(error);
      });

    if (!wallet) {
      throw new WalletNotFoundException();
    }

    return wallet;
  }

  async find({ userId, active }: Partial<Carteiras>): Promise<Carteiras[]> {
    return await this.repository
      .find({
        order: { active: 'DESC', descricao: 'ASC' },
        relations: ['user'],
        where: { userId: userId, active: active },
      })
      .catch((error) => {
        throw new FindWalletException(error);
      });
  }

  async delete(
    id: number,
    userId: string,
  ): Promise<CarteirasDeleteResponseDTO> {
    const entity = await this.findById(id);
    if (userId !== entity.userId) {
      throw new ForbiddenWalletException();
    }
    try {
      await this.repository.remove(entity);
      return new CarteirasDeleteResponseDTO(true);
    } catch (error) {
      throw new DeleteWalletException(error);
    }
  }

  async exists({
    userId,
    id,
  }: Pick<Carteiras, 'userId' | 'id'>): Promise<boolean> {
    const result = await this.repository
      .find({
        where: { userId, id },
        select: { id: true },
      })
      .catch((error) => {
        throw new FindWalletException(error);
      });

    if (!result || !result.length) return false;

    return true;
  }
}
