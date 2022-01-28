export class CategoryDeleteResponseDTO {
  deleted?: boolean;
  message?: string;

  constructor(deleted = true, message?: string) {
    this.deleted = deleted;
    this.message = message;
  }
}
