import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CarteirasDeleteResponseDTO, CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';
import {
  DeleteWalletException,
  FindWalletException,
  ForbiddenWalletException,
  InsertWalletException,
  UpdateWalletException,
} from '@wallet/exception';

import { IWalletRepository } from './wallet.repository.interface';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Carteiras)
    private readonly repository: Repository<Carteiras>,
  ) {}

  async insert(walletRequest: CarteirasDTO): Promise<Carteiras> {
    try {
      const wallet = this.repository.create(walletRequest);
      return await this.repository.save(wallet);
    } catch (error) {
      throw new InsertWalletException(error, walletRequest);
    }
  }

  async update(
    id: number,
    userId: string,
    walletRequest: CarteirasDTO,
  ): Promise<Carteiras> {
    const entity = await this.findById(id);
    if (userId !== entity.userId) {
      throw new ForbiddenWalletException();
    }
    try {
      const wallet = this.repository.create({ ...entity, ...walletRequest });
      return await this.repository.save(wallet);
    } catch (error) {
      throw new UpdateWalletException(error);
    }
  }

  async findById(id: number): Promise<Carteiras> {
    try {
      const wallet = await this.repository.findOneOrFail({
        relations: ['user'],
        where: { id: id },
      });

      return wallet;
    } catch (error) {
      throw new FindWalletException(error);
    }
  }

  async find(userId: string): Promise<Carteiras[]> {
    return await this.repository
      .find({
        order: { descricao: 'ASC' },
        relations: ['user'],
        where: { userId: userId },
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
}
