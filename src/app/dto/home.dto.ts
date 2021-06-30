export class Home {
  constructor(api: string, status: number, version: string) {
    this.api = api;
    this.status = status;
    this.version = version;
  }

  api: string;
  status: number;
  version: string;
}
