// @ts-check
import { NODE_ENV } from "./constants.js";
import { Exeption } from "./exeption.js";

/**
 * @typedef {import('./utils.type.js').IUtils} IUtils
 * @typedef {import('express').Response} Response
 */

/**
 * @class Utils
 * @implements {IUtils}
 */
export class Utils {
  isDevelopment = NODE_ENV === "development";
  /**
   * Build success response
   * @param {string} message - The message to respond client
   * @param {*} data - The data to return
   * @returns The success response
   */
  buildSuccessResponse(message, data) {
    if (this.isDevelopment) console.log(`[SUCCESS] ${message}`);
    return {
      success: true,
      message,
      data,
    };
  }

  /**
   * Build error response
   * @param {Error} error - The error to respond client
   * @param {Response} response - The response object
   * @returns The error response
   */
  buildErrorResponse(error, response) {
    let message = "Internal server error";
    let status = 500;

    if (error instanceof Exeption) {
      message = error.message;
      status = error.status;
    }

    if (this.isDevelopment) console.error(`[ERROR] ${message}`);
    return response.status(status).json({ success: false, message, status });
  }
}
