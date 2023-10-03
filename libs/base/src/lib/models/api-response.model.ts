export interface ApiResponse<T> {
  status: ResponseStatus;
  msg: string;
  data: T;
}

export enum ResponseStatus {
  Nop = 'nop',
  Success = 'success',
  Error = 'error'
}
