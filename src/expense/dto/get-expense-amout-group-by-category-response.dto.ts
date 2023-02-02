export class GetExpenseAmountGroupByCategoryResponse {
  readonly value!: number;
  readonly description!: string;
  readonly id!: number;
  readonly subCategoryData!: SubCategoryData[];

  private constructor(dto: GetExpenseAmountGroupByCategoryResponse) {
    Object.assign(this, dto);
  }

  static build = (
    dto: GetExpenseAmountGroupByCategoryResponse,
  ): GetExpenseAmountGroupByCategoryResponse => {
    return new GetExpenseAmountGroupByCategoryResponse(dto);
  };
}

export type SubCategoryData = {
  id?: number;
  description?: string;
  value?: number;
};
