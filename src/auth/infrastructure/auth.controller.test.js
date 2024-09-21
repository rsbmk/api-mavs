import { AuthService } from "../application/auth.service.js";
import { AuthController } from "./auth.controller.js";

describe("Integrations - AuthController", () => {
  it("login user", async () => {
    const userLoged = {
      username: "test",
      password: "test",
      id: "test",
    };

    const mockUserService = {
      findUserByUsernameWithPassword: jest.fn().mockResolvedValue(userLoged),
    };
    const mockJwtService = {
      sign: jest.fn().mockReturnValue("jwt-test"),
    };
    const mockBcryptService = {
      compare: jest.fn().mockReturnValue(true),
    };

    const authController = new AuthController(new AuthService(mockUserService, mockJwtService, mockBcryptService));

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
    expect(mockJwtService.sign).toHaveBeenCalledWith({ id: userLoged.id });
    expect(mockBcryptService.compare).toHaveBeenCalledWith(userLoged.password, userLoged.password);
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
    expect(mockUserService.findUserByUsernameWithPassword).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Credentials are required", status: 400 });
  });

  it("Throws an error if the password are different", async () => {
    const userLoged = {
      username: "test",
      password: "test-different",
      id: "test",
    };

    const mockUserService = {
      findUserByUsernameWithPassword: jest.fn().mockResolvedValue(userLoged),
    };
    const mockJwtService = {
      sign: jest.fn().mockReturnValue("jwt-test"),
    };
    const mockBcryptService = {
      compare: jest.fn().mockReturnValue(false),
    };

    const authController = new AuthController(new AuthService(mockUserService, mockJwtService, mockBcryptService));

    const req = {
      body: {
        password: "test",
        username: userLoged.username,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockUserService.findUserByUsernameWithPassword).toHaveBeenCalledWith("test");
    expect(mockBcryptService.compare).toHaveBeenCalledWith("test", "test-different");
    expect(mockJwtService.sign).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid credentials", status: 401 });
  });

  it("Throws an error if the username or password are missing", async () => {
    const userLoged = {
      username: "test",
      password: "test",
      id: "test",
    };

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
    expect(mockUserService.findUserByUsernameWithPassword).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Credentials are required", status: 400 });
  });

  it("User service throws an error", async () => {
    const userLoged = {
      username: "test",
      password: "test",
      id: "test",
    };

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
    expect(mockUserService.findUserByUsernameWithPassword).toHaveBeenCalledWith(userLoged.username);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });
});
