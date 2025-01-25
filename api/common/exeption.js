// @ts-check

export class Exeption extends Error {
  /**
   * The status to respond client
   * @type {number}
   */
  status;

  /**
   * Build error response
   * @param {string} message - The message to respond client
   * @param {number} status - The status to respond client
   */
  constructor(message, status = 400) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}
