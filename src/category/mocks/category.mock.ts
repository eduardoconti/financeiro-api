import {
  CategoryDeleteResponseDTO,
  InsertCategoryRequestDTO,
} from '@category/dto';
import { Category } from '@category/entity';

import { fakeUserId } from '@expense/mocks';

const fakeCategoryId = 1;
export const fakeCategoryEntity = Category.build({
  id: fakeCategoryId,
  descricao: 'Fake Category',
  userId: fakeUserId,
});

export const fakeCategoryRequest = InsertCategoryRequestDTO.build({
  descricao: 'Fake Category',
});

export const fakeDeletedCategoryResponse = new CategoryDeleteResponseDTO();
