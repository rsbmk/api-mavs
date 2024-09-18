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
  it("should return an error response object with success set to false when called", () => {
    const instance = new Utils();
    const message = "An error occurred";
    const response = instance.buildErrorResponse(message);

    expect(response).toEqual({ success: false, message });
  });

  it("should log error message to console in development environment", () => {
    const instance = new Utils();
    instance.isDevelopment = true;
    console.error = jest.fn();
    const message = "An error occurred";

    instance.buildErrorResponse(message);

    expect(console.error).toHaveBeenCalledWith(`[ERROR] ${message}`);
  });

  it("should handle empty string as message", () => {
    const instance = new Utils();
    const message = "";
    const response = instance.buildErrorResponse(message);

    expect(response).toEqual({ success: false, message });
  });

  it("should handle null as message", () => {
    const instance = new Utils();
    const message = null;
    const response = instance.buildErrorResponse(message);

    expect(response).toEqual({ success: false, message });
  });

  it("should handle undefined as message", () => {
    const instance = new Utils();
    const message = undefined;
    const response = instance.buildErrorResponse(message);

    expect(response).toEqual({ success: false, message });
  });
});
