import { Response } from "express";

export type IUtils = {
  buildSuccessResponse: (message: string, data: any) => object;
  buildErrorResponse: (Error: Error, response: Response) => object;
};

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

export type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>