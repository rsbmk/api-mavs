// @ts-check
/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 *
 * @param {Request} _request
 * @param {Response} response
 */
export const notFound = (_request, response) => {
  response.status(404).json({ message: "not found" });
};
