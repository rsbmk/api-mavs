import bcrypt from "bcrypt";

import { AuthService } from "../application/auth.service.js";
import { AuthController } from "./auth.controller.js";

describe("Integrations - AuthController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("login user", async () => {
    const userLoged = {
      username: "test",
      password: "test",
      id: "test",
    };

    const mockBcrypt = jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    const mockUserService = {
      findUserByUsernameWithPassword: jest.fn().mockResolvedValue(userLoged),
    };
    const mockJwtService = {
      sign: jest.fn().mockReturnValue("jwt-test"),
    };
    const authController = new AuthController(new AuthService(mockUserService, mockJwtService));

    const req = {
      body: {
        username: userLoged.username,
        password: userLoged.password,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockBcrypt).toHaveBeenCalledWith("test", "test");
    expect(mockUserService.findUserByUsernameWithPassword).toHaveBeenCalledWith("test");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "user loged",
      data: { id: userLoged.id, username: userLoged.username, token: "jwt-test" },
    });
  });

  it("Throws an error if the username or password are missing", async () => {
    const userLoged = {
      username: "test",
      password: "test",
      id: "test",
    };

    const mockBcrypt = jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const mockUserService = {
      findUserByUsernameWithPassword: jest.fn().mockResolvedValue(userLoged),
    };

    const authController = new AuthController(new AuthService(mockUserService));

    const req = {
      body: {
        password: null,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockBcrypt).not.toHaveBeenCalled();
    expect(mockUserService.findUserByUsernameWithPassword).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Credentials are required", status: 400 });
  });

  it("Throws an error if the password are different", async () => {
    const userLoged = {
      username: "test",
      password: "test",
      id: "test",
    };

    const mockBcrypt = jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const mockUserService = {
      findUserByUsernameWithPassword: jest.fn().mockResolvedValue(userLoged),
    };

    const authController = new AuthController(new AuthService(mockUserService));

    const req = {
      body: {
        password: userLoged.password,
        username: userLoged.username,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockBcrypt).toHaveBeenCalledWith("test", "test");
    expect(mockUserService.findUserByUsernameWithPassword).toHaveBeenCalledWith("test");
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid credentials", status: 401 });
  });

  it("Throws an error if the username or password are missing", async () => {
    const userLoged = {
      username: "test",
      password: "test",
      id: "test",
    };

    const mockBcrypt = jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const mockUserService = {
      findUserByUsernameWithPassword: jest.fn().mockResolvedValue(userLoged),
    };

    const authController = new AuthController(new AuthService(mockUserService));

    const req = {
      body: {
        password: null,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockBcrypt).not.toHaveBeenCalled();
    expect(mockUserService.findUserByUsernameWithPassword).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Credentials are required", status: 400 });
  });

  it("User service throws an error", async () => {
    const userLoged = {
      username: "test",
      password: "test",
      id: "test",
    };

    const mockBcrypt = jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const mockUserService = {
      findUserByUsernameWithPassword: jest.fn().mockRejectedValue(new Error("test error")),
    };

    const authController = new AuthController(new AuthService(mockUserService));

    const req = {
      body: {
        password: userLoged.password,
        username: userLoged.username,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(mockBcrypt).not.toHaveBeenCalled();
    expect(mockUserService.findUserByUsernameWithPassword).toHaveBeenCalledWith(userLoged.username);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });
});
