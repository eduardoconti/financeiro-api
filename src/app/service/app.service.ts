import { Home } from '@app/dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppService } from './app.service.interface';

@Injectable()
export class AppService implements IAppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): Home {
    return new Home(
      this.configService.get('API_NAME'),
      HttpStatus.OK,
      this.configService.get('VERSION'),
    );
  }
}
