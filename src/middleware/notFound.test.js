import { notFound } from "./notFound.js";

describe("notFound", () => {
  it("should return 404 status code when invoked", () => {
    const request = {};
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    notFound(request, response, next);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ message: "not found" });
  });

  it("should handle null response object", () => {
    const request = {};
    const response = null;
    const next = jest.fn();

    expect(() => notFound(request, response, next)).toThrow();
  });

  it("should handle null next function", () => {
    const request = {};
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = null;

    notFound(request, response, next);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ message: "not found" });
  });
});
