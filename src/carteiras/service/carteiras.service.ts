import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CarteirasDeleteResponseDTO } from '@carteiras/dto';

import { CarteirasDTO } from '../dto/carteiras.dto';
import { Carteiras } from '../entity/carteiras.entity';
import { ICarteirasService } from './carteiras.service.interface';

@Injectable()
export class CarteirasService implements ICarteirasService {
  constructor(
    @Inject('CARTEIRAS')
    private carteiraRepository: Repository<Carteiras>,
  ) {}

  async getOne(id: number): Promise<Carteiras> {
    try {
      const carteira = await this.carteiraRepository.findOneOrFail(
        { id },
        { relations: ['user'] },
      );

      return carteira;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async retornaTodasCarteiras(userId: string): Promise<Carteiras[]> {
    try {
      return await this.carteiraRepository.find({
        order: { id: 'ASC' },
        relations: ['user'],
        where: { user: userId },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async insereCarteira(carteira: CarteirasDTO): Promise<Carteiras> {
    try {
      const newCarteiras = this.carteiraRepository.create(carteira);
      await this.carteiraRepository.save(newCarteiras);
      return newCarteiras;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletaCarteira(id: number): Promise<CarteirasDeleteResponseDTO> {
    try {
      await this.getOne(id);
      await this.carteiraRepository.delete({ id });
      return new CarteirasDeleteResponseDTO(true);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraCarteira(id: number, carteira: CarteirasDTO): Promise<Carteiras> {
    try {
      await this.getOne(id);
      await this.carteiraRepository.update({ id }, carteira);
      return await this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
