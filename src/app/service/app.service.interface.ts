import { HomeDTO } from '@app/dto';

export interface IAppService {
  healthCheck(): HomeDTO;
}
