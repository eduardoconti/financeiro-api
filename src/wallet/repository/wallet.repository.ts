import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CarteirasDeleteResponseDTO, CarteirasDTO } from '@wallet/dto';
import { Carteiras } from '@wallet/entity';

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
      await this.repository.save(wallet);
      return wallet;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, walletRequest: CarteirasDTO): Promise<Carteiras> {
    try {
      await this.findById(id);
      await this.repository.update({ id }, walletRequest);
      return await this.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: number): Promise<Carteiras> {
    try {
      const wallet = await this.repository.findOneOrFail(
        { id },
        { relations: ['user'] },
      );

      return wallet;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async find(userId: string): Promise<Carteiras[]> {
    try {
      return await this.repository.find({
        order: { id: 'ASC' },
        relations: ['user'],
        where: { userId: userId },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: number): Promise<CarteirasDeleteResponseDTO> {
    try {
      await this.findById(id);
      await this.repository.delete({ id });
      return new CarteirasDeleteResponseDTO(true);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
