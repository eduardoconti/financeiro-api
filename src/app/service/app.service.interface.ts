import { HomeDTO } from '@app/dto';

export interface IAppService {
  getHello(): HomeDTO;
}
