// @ts-check

/**
 * @typedef {import('../domain/bcrypt.type').IBcryptService} IBcryptService
 * @typedef {import('../domain/bcrypt.type').IBcrypt} IBcrypt
 */

/**
 * @class BcryptService
 * @implements {IBcryptService}
 */
export class BcryptService {
  /**
   * @type {IBcrypt}
   */
  bcrypt;

  /**
   * Creates an instance of BcryptService.
   * @param {IBcrypt} bcrypt - Bcrypt
   */
  constructor(bcrypt) {
    this.bcrypt = bcrypt;
  }

  /**
   * Compares two passwords
   * @param {string} password - the password to be compared
   * @param {string} hash - the hash to be compared
   * @returns {Promise<boolean>} the result of the comparison
   */
  compare(password, hash) {
    return this.bcrypt.compare(password, hash);
  }

  /**
   * Hash password
   * @param {string} password - the password
   * @param {string} salt - the salt
   * @returns {Promise<string>} the hashed password
   */
  hash(password, salt) {
    return this.bcrypt.hash(password, salt);
  }

  /**
   * Generate salt
   * @param {number} rounds - the number of rounds
   * @returns {Promise<string>} the salt
   */
  async genSalt(rounds) {
    return this.bcrypt.genSalt(rounds) || String(rounds);
  }
}
