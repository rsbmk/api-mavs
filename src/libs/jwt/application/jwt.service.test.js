import { EXPIRATION_JWT, SECRET_JWT } from "../../../common/constants.js";
import { JwtService } from "./jwt.service.js";

describe("JwtService - verify", () => {
  it("should verify a token", () => {
    const mockJWT = {
      verify: jest.fn().mockReturnValue({
        id: "test-id",
      }),
    };
    const jwtService = new JwtService(mockJWT);
    const token = jwtService.verify("token");

    expect(token).toEqual({ id: "test-id" });
    expect(mockJWT.verify).toHaveBeenCalledWith("token", SECRET_JWT);
  });

  it("should throw an error if the token is not valid", () => {
    const mockJWT = {
      verify: jest.fn().mockReturnValue(null),
    };
    const jwtService = new JwtService(mockJWT);
    expect(() => jwtService.verify()).toThrow("The token is required");
    expect(mockJWT.verify).not.toHaveBeenCalled();
  });
});

describe("JwtService - sign", () => {
  it("should sign a token", () => {
    const mockJWT = {
      sign: jest.fn().mockReturnValue("token"),
    };
    const jwtService = new JwtService(mockJWT);
    const token = jwtService.sign({ id: "test-id" });

    expect(token).toEqual("token");
    expect(mockJWT.sign).toHaveBeenCalledWith({ id: "test-id" }, SECRET_JWT, {
      expiresIn: EXPIRATION_JWT,
    });
  });

  it("should throw an error if the token is not valid", () => {
    const mockJWT = {
      sign: jest.fn().mockReturnValue(null),
    };
    const jwtService = new JwtService(mockJWT);
    expect(() => jwtService.sign()).toThrow("The token is required");
    expect(mockJWT.sign).not.toHaveBeenCalled();
  });

  it("should throw an error if the token data is not valid", () => {
    const mockJWT = {
      sign: jest.fn().mockReturnValue(null),
    };
    const jwtService = new JwtService(mockJWT);
    expect(() => jwtService.sign({})).toThrow("The token data is required");
    expect(mockJWT.sign).not.toHaveBeenCalled();
  });
});
