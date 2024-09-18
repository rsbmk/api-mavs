// @ts-check
import { NODE_ENV } from "../common/constants.js";

/**
 * @typedef {{
 *   buildSuccessResponse: (message: string, data: any) => {},
 *   buildErrorResponse: (message: string) => {},
 * }} IUtils
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
   * @param {string} message - The message to respond client
   * @returns The error response
   */
  buildErrorResponse(message) {
    if (this.isDevelopment) console.error(`[ERROR] ${message}`);
    return {
      success: false,
      message,
    };
  }
}
