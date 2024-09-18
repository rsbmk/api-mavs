import { JwtService } from "../../libs/jwt/application/jwt.service.js";
import { SECRET_JWT } from "../../common/constants.js";
import { JwtApiGuard } from "./jwtApi.guard.js";

describe("JwtApiGuard", () => {
  it("should authorize a user", () => {
    const mockJWT = {
      verify: jest.fn().mockReturnValue({
        id: "test-id",
      }),
    };
    const jwtApiGuard = new JwtApiGuard(new JwtService(mockJWT));

    const req = {
      get: jest.fn().mockReturnValue("Bearer token"),
    };
    const res = {};
    const next = jest.fn();

    jwtApiGuard.run(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(mockJWT.verify).toHaveBeenCalledWith("token", SECRET_JWT);
    expect(req.userId).toEqual("test-id");
    expect(req.get).toHaveBeenCalledWith("authorization");
  });

  it("should not authorize a user if the header authorization is not present", () => {
    const mockJWT = {
      verify: jest.fn(),
    };

    const jwtApiGuard = new JwtApiGuard(new JwtService(mockJWT));

    const req = {
      get: jest.fn(),
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    jwtApiGuard.run(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(req.get).toHaveBeenCalledWith("authorization");
    expect(req.userId).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "no authorization",
      success: false,
    });
  });
});
