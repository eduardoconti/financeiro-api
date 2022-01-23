import { CarteirasDeleteResponseDTO, CarteirasDTO } from "@carteiras/dto";
import { Carteiras } from "@carteiras/entity";

export interface ICarteirasService {
    getOne(id: number): Promise<Carteiras>
    retornaTodasCarteiras(userId: string): Promise<Carteiras[]>
    insereCarteira(carteira: CarteirasDTO): Promise<Carteiras>
    deletaCarteira(id: number): Promise<CarteirasDeleteResponseDTO>
    alteraCarteira(
        id: number,
        carteira: CarteirasDTO
      ): Promise<Carteiras>
}