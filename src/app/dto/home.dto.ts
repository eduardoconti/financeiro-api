export class HomeDTO {
  constructor(api?: string, status?: number, version?: string) {
    this.api = api;
    this.status = status;
    this.version = version;
  }

  api: string | undefined;
  status: number | undefined;
  version: string | undefined;
}
