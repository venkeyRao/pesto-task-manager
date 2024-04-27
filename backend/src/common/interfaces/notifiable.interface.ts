export interface NotifiableInterface {
  notify(to: string, data: any): Promise<void>;
}
