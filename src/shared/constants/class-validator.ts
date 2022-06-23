import { LengthLimit } from './dto';

export const CONSTRAINTS_MESSAGES = {
  IS_NOT_EMPTY: 'O campo $property não pode ser nulo',
  IS_STRING: 'O campo $property deve ser string',
  IS_NUMBER: 'O campo $property deve ser numérico',
  IS_INTEGER: 'O campo $property deve ser integer',
  IS_DATE: 'O campo $property deve ser data',
  IS_BOOLEAN: 'O campo $property deve ser boolean',
  IS_LENGTH:
    'O campo $property deve ter de $constraint1 a $constraint2 caracteres',
  IS_UUID4: 'O campo $property deve ser uuid4',
  INSTALMENT: 'O campo $property deve ser maior ou igual ao valor',
};

export const CONSTRAINTS_LIMITS = {
  LOGIN: new LengthLimit(6, 12),
  PASSWORD: new LengthLimit(6, 12),
  DESCRICAO: new LengthLimit(2, 30),
  NOME: new LengthLimit(2, 30),
};
