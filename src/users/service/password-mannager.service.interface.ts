export interface IPasswordManagerService {
    getHash(password: string): Promise<string>
    compareHash(password: string, hash: string): Promise<boolean>
}