import {
  CategoryDeleteResponseDTO,
  InsertCategoryRequestDTO,
} from '@category/dto';
import { Category } from '@category/entity';

const fakeUserId = '37f5c664-274f-47b2-811b-e3cdd093f27f';
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
