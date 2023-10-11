import { NonVoid } from './types';

export const isDefined = <T>(value: T | undefined | null): value is NonVoid<T> => {
  return value !== null && value !== undefined;
};
