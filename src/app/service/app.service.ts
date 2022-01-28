import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HomeDTO } from '@app/dto';

import { IAppService } from './app.service.interface';

@Injectable()
export class AppService implements IAppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): HomeDTO {
    return new HomeDTO(
      this.configService.get('API_NAME'),
      HttpStatus.OK,
      this.configService.get('VERSION'),
    );
  }
}
