export type NonVoid<T> = T extends null | undefined | void ? never : T;
