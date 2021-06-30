import { Injectable } from '@nestjs/common';
import { Home } from './dto/home.dto';

@Injectable()
export class AppService {
  getHello() {
    return new Home(process.env.API_NAME, 200, process.env.VERSION);
  }
}
