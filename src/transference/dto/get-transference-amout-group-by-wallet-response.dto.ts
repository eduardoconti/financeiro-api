import { Transform } from 'class-transformer';

export class GetTransferenceAmountGroupByWalletResponse {
  @Transform(({ value }) => Math.round(value * 100) / 100)
  readonly valor: number;
  readonly descricao: string;
  readonly id: number;

  private constructor(valor: number, descricao: string, id: number) {
    this.valor = valor;
    this.descricao = descricao;
    this.id = id;
  }

  static build = ({
    valor,
    descricao,
    id,
  }: GetTransferenceAmountGroupByWalletResponse): GetTransferenceAmountGroupByWalletResponse => {
    return new GetTransferenceAmountGroupByWalletResponse(valor, descricao, id);
  };
}