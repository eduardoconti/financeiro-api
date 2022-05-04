import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export const SwaggerApiInternalServerErrorResponse = (
  title: string,
  detail?: string,
) => {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      schema: {
        title: 'ErrorResponseDTO',
        allOf: [
          {
            properties: {
              status: {
                example: HttpStatus.INTERNAL_SERVER_ERROR,
                type: 'number',
              },
              title: { example: title, type: 'string' },
              detail: { example: detail, type: 'string' },
            },
          },
        ],
      },
      description: title,
    }),
  );
};
