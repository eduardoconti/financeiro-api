export class UserDeleteResponseDTO {
  deleted: boolean;
  message?: string;

  constructor(deleted: boolean, message?: string) {
    this.deleted = deleted;
    this.message = message;
  }
}
