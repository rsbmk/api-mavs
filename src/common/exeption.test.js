import { Exeption } from "./exeption";

describe("Exeption", () => {
  it("should create an instance with a custom message and status", () => {
    const message = "Custom error message";
    const status = 404;
    const exception = new Exeption(message, status);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(status);
    expect(exception.name).toBe("Exeption");
  });

  it("should create an instance with a custom message and default status", () => {
    const message = "Default status error message";
    const exception = new Exeption(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(400);
    expect(exception.name).toBe("Exeption");
  });

  it("should create an instance with an empty message", () => {
    const message = "";
    const exception = new Exeption(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(400);
    expect(exception.name).toBe("Exeption");
  });

  it("should create an instance with a non-numeric status", () => {
    const message = "Non-numeric status error";
    const status = "not-a-number";
    const exception = new Exeption(message, status);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(status);
    expect(exception.name).toBe("Exeption");
  });

  it("should create an instance with a very large status number", () => {
    const message = "Large status number error";
    const status = 999999999;
    const exception = new Exeption(message, status);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(status);
    expect(exception.name).toBe("Exeption");
  });
});
