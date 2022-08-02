import {
  InsertSubCategoryRequestDTO,
  SubCategoryDeleteResponseDTO,
} from '@category/dto/sub-category';
import { SubCategory } from '@category/entity';

import { fakeUserId } from '@expense/mocks';

const fakeSubCategoryId = 1;
export const fakeSubCategoryEntity = SubCategory.build({
  id: fakeSubCategoryId,
  description: 'Fake SubCategory',
  userId: fakeUserId,
  categoryId: 1,
});

export const fakeSubCategoryRequest = InsertSubCategoryRequestDTO.build({
  description: 'Fake SubCategory',
  categoryId: 1,
});

export const fakeDeletedSubCategoryResponse =
  new SubCategoryDeleteResponseDTO();
