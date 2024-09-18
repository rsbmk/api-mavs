import { Response } from "express";

export type IUtils = {
  buildSuccessResponse: (message: string, data: any) => object;
  buildErrorResponse: (Error: Error, response: Response) => object;
};
