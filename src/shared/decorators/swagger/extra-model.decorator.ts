import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { HomeDTO } from '@app/dto';

export const ExtraModels = () => {
  return applyDecorators(ApiExtraModels(HomeDTO));
};
