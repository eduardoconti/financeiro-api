import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { HttpInternalMessages } from '@shared/enums';

export const SwaggerApiSuccessResponse = <TModel extends Type<any>>(
  message: string,
  model: TModel,
  status: HttpStatus = HttpStatus.OK,
  internalMessage: string = HttpInternalMessages.OK,
) => {
  return applyDecorators(
    ApiResponse({
      schema: {
        title: 'SuccessResponseDTO',
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
          data: { $ref: getSchemaPath(model) },
        },
      },
      status: status,
      description: message,
    }),
  );
};
