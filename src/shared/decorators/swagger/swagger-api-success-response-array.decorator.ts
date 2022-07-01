import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { HttpInternalMessages } from '@shared/enums';

export const SwaggerApiSuccessArrayResponse = <TModel extends Type<any>>(
  message: string,
  model: TModel,
  status: HttpStatus = HttpStatus.OK,
  internalMessage: string = HttpInternalMessages.OK,
) => {
  return applyDecorators(
    ApiResponse({
      schema: {
        properties: {
          status: {
            example: status,
            type: 'number',
            description: 'Http status',
          },
          message: {
            example: message,
            type: 'string',
            description: 'Response message',
          },
          internalMessage: {
            example: internalMessage,
            type: 'string',
            description: 'Response internalMessage',
          },
          data: { items: { $ref: getSchemaPath(model) } },
        },
      },
      status: status,
      description: message,
    }),
  );
};
