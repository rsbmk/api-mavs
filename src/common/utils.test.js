import { Exeption } from "./exeption.js";
import { Utils } from "./utils.js";

describe("buildSuccessResponse", () => {
  it("should return an object with success set to true when called with valid message and data", () => {
    const utils = new Utils();
    const message = "Operation successful";
    const data = { id: 1, name: "Test" };
    const response = utils.buildSuccessResponse(message, data);

    expect(response).toEqual({
      success: true,
      message,
      data,
    });
  });

  it("should log the success message to the console in development environment", () => {
    const utils = new Utils();
    utils.isDevelopment = true;
    console.log = jest.fn();
    const message = "Operation successful";
    const data = { id: 1, name: "Test" };

    utils.buildSuccessResponse(message, data);

    expect(console.log).toHaveBeenCalledWith(`[SUCCESS] ${message}`);
  });

  it("should handle empty string as message", () => {
    const utils = new Utils();
    const message = "";
    const data = { id: 1, name: "Test" };
    const response = utils.buildSuccessResponse(message, data);

    expect(response).toEqual({
      success: true,
      message,
      data,
    });
  });

  it("should handle null as data", () => {
    const utils = new Utils();
    const message = "Operation successful";
    const data = null;
    const response = utils.buildSuccessResponse(message, data);

    expect(response).toEqual({
      success: true,
      message,
      data,
    });
  });

  it("should handle undefined as data", () => {
    const utils = new Utils();
    const message = "Operation successful";
    const data = undefined;
    const response = utils.buildSuccessResponse(message, data);

    expect(response).toEqual({
      success: true,
      message,
      data,
    });
  });
});

describe("buildErrorResponse", () => {
  it("should return default error message and status 500 for generic errors", () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const error = new Error("Some generic error");
    const utils = new Utils();

    utils.buildErrorResponse(error, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should return custom error message and status for Exeption instances", () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const error = new Exeption("Custom error message", 404);
    const utils = new Utils();

    utils.buildErrorResponse(error, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: "Custom error message", status: 404 });
  });

  it("should handle null or undefined error object", () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const utils = new Utils();

    utils.buildErrorResponse(null, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should handle null or undefined response object", () => {
    const utils = new Utils();

    expect(() => utils.buildErrorResponse(new Error("Some error"), null)).toThrow();
  });

  it("should handle error object without message property", () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const error = { status: 400 };
    const utils = new Utils();

    utils.buildErrorResponse(error, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should log if is development environment", () => {
    const utils = new Utils();
    utils.isDevelopment = true;
    console.error = jest.fn();
    const error = new Exeption("Custom error message", 404);
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    utils.buildErrorResponse(error, response);

    expect(console.error).toHaveBeenCalledWith("[ERROR] Custom error message");
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ success: false, message: "Custom error message", status: 404 });
  });
});
