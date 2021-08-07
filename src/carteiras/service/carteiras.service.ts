import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/shared/constants/messages';
import { Repository } from 'typeorm';
import { CarteirasDTO } from '../dto/carteiras.dto';
import { Carteiras } from '../entity/carteiras.entity';

@Injectable()
export class CarteirasService {
  constructor(
    @Inject('CARTEIRAS')
    private carteiraRepository: Repository<Carteiras>,
  ) {}

  async getOne(id: number, userId?: string): Promise<Carteiras> {
    try {
      let carteira = await this.carteiraRepository.findOneOrFail(
        { id },
        { relations: ['user'] },
      );
      if (userId && carteira.user.id !== userId) {
        throw new UnauthorizedException(
          ERROR_MESSAGES.USER_TOKEN_NOT_EQUALS_TO_PARAM_URL,
        );
      }
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

  async deletaCarteira(
    id: number,
    userId: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.getOne(id, userId);
      await this.carteiraRepository.delete({ id });
      return { deleted: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async alteraCarteira(
    id: number,
    carteira: CarteirasDTO,
    userId: string,
  ): Promise<Carteiras> {
    try {
      await this.getOne(id, userId);
      await this.carteiraRepository.update({ id }, carteira);
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
