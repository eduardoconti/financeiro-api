export interface IEventEmitter {
  emit<T>(event: string, ...args: T[]): void;
}
