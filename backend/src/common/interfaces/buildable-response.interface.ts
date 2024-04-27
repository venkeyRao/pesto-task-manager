export interface BuildableResponseInterface {
  build(...arg: any): Promise<any>;
}
