import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { User } from 'src/shared/decorator/user.decorator';
import { Repository } from 'typeorm';
import { CarteirasDTO } from '../dto/carteiras.dto';
import { Carteiras } from '../entity/carteiras.entity';

@Injectable()
export class CarteirasService {
  constructor(
    @Inject('CARTEIRAS')
    private carteiraRepository: Repository<Carteiras>,
  ) {}

  async getOne(id: number): Promise<Carteiras> {
    try {
      return await this.carteiraRepository.findOneOrFail({ id });
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

  async deletaCarteira(
    id: number,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.carteiraRepository.delete({ id });
      return { deleted: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraCarteira(id: number, carteira: CarteirasDTO): Promise<Carteiras> {
    try {
      await this.carteiraRepository.update({ id }, carteira);
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
