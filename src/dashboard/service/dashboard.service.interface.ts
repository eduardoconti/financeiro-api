import { DashBoardValues, GetDashBoardValuesParams } from '@dashboard/dto';

export interface IDashBoardService {
  getValues(
    userId: string,
    params: GetDashBoardValuesParams,
  ): Promise<DashBoardValues>;
}
