import { UserDeleteResponseDTO, UserDto } from "@users/dto";
import { Users } from "@users/entity";

export interface IUserService {
    returnAllUsers(): Promise<Users[]>
    returnUserByLogin(login: string): Promise<Users>
    createUser(user: UserDto): Promise<Users>
    deletUser(id: string): Promise<UserDeleteResponseDTO>
}