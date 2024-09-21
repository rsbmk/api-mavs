import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "../application/user.service.js";

describe("create", () => {
  it("should create a user when valid data is provided", async () => {
    const req = { body: { name: "John Doe", username: "johndoe", password: "password123" } };
    const res = { status: jest.fn().mockReturnThis(201), json: jest.fn() };
    const userService = { create: jest.fn().mockResolvedValue({ id: 1, name: "John Doe", username: "johndoe" }) };
    const controller = new UserController(userService);

    await controller.create(req, res);

    expect(userService.create).toHaveBeenCalledWith({ name: "John Doe", username: "johndoe", password: "password123" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "user created", success: true, data: { id: 1, name: "John Doe", username: "johndoe" } });
  });

  it("should return 201 status code on successful user creation", async () => {
    const req = { body: { name: "Jane Doe", username: "janedoe", password: "password123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { create: jest.fn().mockResolvedValue({ id: 2, name: "Jane Doe", username: "janedoe" }) };

    const controller = new UserController(userService);
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should handle missing name, username, or password in the request body", async () => {
    const req = { body: { username: "janedoe", password: "password123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { create: jest.fn().mockRejectedValue(new Error("Missing required fields")) };

    const controller = new UserController(userService);
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should handle invalid data types for name, username, or password", async () => {
    const req = { body: { name: 12345, username: true, password: {} } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { create: jest.fn().mockRejectedValue(new Error("Invalid data types")) };

    const controller = new UserController(userService);
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should handle empty request body", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { create: jest.fn().mockRejectedValue(new Error("Empty request body")) };

    const controller = new UserController(userService);
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });
});

describe("findOneById", () => {
  it("should retrieve a user by ID when the user exists", async () => {
    const req = { params: { id: "123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { findOneById: jest.fn().mockResolvedValue({ id: "123", name: "John Doe" }) };

    const controller = new UserController(userService);
    await controller.findOneById(req, res);

    expect(userService.findOneById).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user found", data: { id: "123", name: "John Doe" } });
  });

  it("should return 200 status code when user is found", async () => {
    const req = { params: { id: "123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { findOneById: jest.fn().mockResolvedValue({ id: "123", name: "John Doe" }) };

    const controller = new UserController(userService);
    await controller.findOneById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 status code when user ID does not exist", async () => {
    const req = { params: { id: "999" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { findOneById: jest.fn().mockRejectedValue(new Error("User not found")) };

    const controller = new UserController(userService);
    await controller.findOneById(req, res);

    expect(userService.findOneById).toHaveBeenCalledWith("999");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should return 404 status code when user ID is not provided", async () => {
    const req = { params: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { findOneById: jest.fn().mockRejectedValue(new Error("User not found")) };

    const controller = new UserController(userService);
    await controller.findOneById(req, res);

    expect(userService.findOneById).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should return 404 status code when user ID is invalid or malformed", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { findOneById: jest.fn().mockRejectedValue(new Error("User not found")) };

    const controller = new UserController(userService);
    await controller.findOneById(req, res);

    expect(userService.findOneById).toHaveBeenCalledWith("invalid-id");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });
});

describe("findOneByUsername", () => {
  it("should return 200 status and user data when user is found by username", async () => {
    const req = { params: { username: "john_doe" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      findOneByUsername: jest.fn().mockResolvedValue({ id: 1, username: "john_doe" }),
    };

    const userController = new UserController(userService);
    await userController.findOneByUsername(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user found", data: { id: 1, username: "john_doe" } });
    expect(userService.findOneByUsername).toHaveBeenCalledWith("john_doe");
  });

  it("should return 200 status and user data when user is found by username", async () => {
    const req = { params: { username: "john_doe" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      findOneByUsername: jest.fn().mockResolvedValue({ id: 1, username: "john_doe" }),
    };

    const userController = new UserController(userService);
    await userController.findOneByUsername(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user found", data: { id: 1, username: "john_doe" } });
    expect(userService.findOneByUsername).toHaveBeenCalledWith("john_doe");
  });

  it("should return 404 status when user is not found by username", async () => {
    const req = { params: { username: "unknown_user" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const userService = {
      findOneByUsername: jest.fn().mockRejectedValue(new Error("User not found")),
    };
    const userController = new UserController(userService);

    await userController.findOneByUsername(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
    expect(userService.findOneByUsername).toHaveBeenCalledWith("unknown_user");
  });

  it("should return 404 status when user is not found", async () => {
    const req = { params: { username: "unknown_user" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const userService = {
      findOneByUsername: jest.fn().mockRejectedValue(new Error("User not found")),
    };

    const userController = new UserController(userService);
    await userController.findOneByUsername(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
    expect(userService.findOneByUsername).toHaveBeenCalledWith("unknown_user");
  });

  it("should handle cases where username parameter is missing or undefined", async () => {
    const req = { params: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const userService = {
      findOneByUsername: jest.fn().mockRejectedValue(new Error("Username parameter is missing or undefined")),
    };

    const userController = new UserController(userService);
    await userController.findOneByUsername(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });
});

describe("update", () => {
  it("should update user when valid id and user data are provided", async () => {
    const req = { params: { id: "123" }, body: { name: "John Doe" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      update: jest.fn().mockResolvedValue({ id: "123", name: "John Doe" }),
    };

    const utils = {
      buildSuccessResponse: jest.fn().mockReturnValue({ success: true, message: "user updated", data: { id: "123", name: "John Doe" } }),
    };

    const userController = new UserController(userService, utils);
    await userController.update(req, res);

    expect(userService.update).toHaveBeenCalledWith("123", { name: "John Doe" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user updated", data: { id: "123", name: "John Doe" } });
  });

  it("should return 200 status code with success message when update is successful", async () => {
    const req = { params: { id: "123" }, body: { name: "John Doe" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      update: jest.fn().mockResolvedValue({ id: "123", name: "John Doe" }),
    };

    const utils = {
      buildSuccessResponse: jest.fn().mockReturnValue({ success: true, message: "user updated", data: { id: "123", name: "John Doe" } }),
    };

    const userController = new UserController(userService, utils);
    await userController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user updated", data: { id: "123", name: "John Doe" } });
  });

  it("should return 404 status code when user id does not exist", async () => {
    const req = { params: { id: "999" }, body: { name: "John Doe" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      update: jest.fn().mockRejectedValue(new Error("User not found")),
    };

    const utils = {
      buildErrorResponse: jest.fn().mockReturnValue({ success: false, message: "User not found" }),
    };

    const userController = new UserController(userService, utils);
    await userController.update(req, res);

    expect(userService.update).toHaveBeenCalledWith("999", { name: "John Doe" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should return 404 status code with error message when update fails", async () => {
    const req = { params: { id: "123" }, body: { name: "John Doe" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      update: jest.fn().mockRejectedValue(new Error("Update failed")),
    };

    const utils = {
      buildErrorResponse: jest.fn().mockReturnValue({ success: false, message: "Update failed" }),
    };

    const userController = new UserController(userService, utils);
    await userController.update(req, res);

    expect(userService.update).toHaveBeenCalledWith("123", { name: "John Doe" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });

  it("should handle invalid user data in request body", async () => {
    const req = { params: { id: "123" }, body: null };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      update: jest.fn().mockRejectedValue(new Error("Invalid data")),
    };

    const utils = {
      buildErrorResponse: jest.fn().mockReturnValue({ success: false, message: "Invalid data" }),
    };

    const userController = new UserController(userService, utils);
    await userController.update(req, res);

    expect(userService.update).toHaveBeenCalledWith("123", null);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });
});

describe("delete", () => {
  it("should delete a user when a valid ID is provided", async () => {
    const req = { params: { id: "valid_id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      delete: jest.fn().mockResolvedValue({ id: "valid_id" }),
    };

    const utils = {
      buildSuccessResponse: jest.fn().mockReturnValue({ success: true, message: "user deleted", data: { id: "valid_id" } }),
    };

    const userController = new UserController(userService, utils);
    await userController.delete(req, res);

    expect(userService.delete).toHaveBeenCalledWith("valid_id");
  });

  it("should return 200 status code on successful deletion", async () => {
    const req = { params: { id: "valid_id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      delete: jest.fn().mockResolvedValue({ id: "valid_id" }),
    };

    const utils = {
      buildSuccessResponse: jest.fn().mockReturnValue({ success: true, message: "user deleted", data: { id: "valid_id" } }),
    };

    const userController = new UserController(userService, utils);
    await userController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should handle the case where the user ID does not exist", async () => {
    const req = { params: { id: "invalid_id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      delete: jest.fn().mockRejectedValue(new Error("User not found")),
    };

    const utils = {
      buildErrorResponse: jest.fn().mockReturnValue({ success: false, message: "User not found" }),
    };

    const userController = new UserController(userService, utils);
    await userController.delete(req, res);

    expect(userService.delete).toHaveBeenCalledWith("invalid_id");
  });

  it("should return 404 status code if the user ID is not found", async () => {
    const req = { params: { id: "invalid_id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      delete: jest.fn().mockRejectedValue(new Error("User not found")),
    };

    const utils = {
      buildErrorResponse: jest.fn().mockReturnValue({ success: false, message: "User not found" }),
    };

    const userController = new UserController(userService, utils);
    await userController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return an error message in the response body if the user ID is not found", async () => {
    const req = { params: { id: "invalid_id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const userService = {
      delete: jest.fn().mockRejectedValue(new Error("User not found")),
    };

    const utils = {
      buildErrorResponse: jest.fn().mockReturnValue({ success: false, message: "User not found" }),
    };

    const userController = new UserController(userService, utils);
    await userController.delete(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error", status: 500 });
  });
});

/**
 * Integrations tests
 */

describe("Integrations - create user", () => {
  it("should create a new user", async () => {
    const userModel = {
      create: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue(null),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const req = {
      body: {
        name: "test",
        username: "test",
        password: "test",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.create(req, res);

    expect(userModel.create).toHaveBeenCalled();
    expect(userModel.create).not.toHaveBeenCalledWith({ password: "test" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user created", data: {} });
  });

  it("should return an error message in the response body if the user already exists", async () => {
    const req = {
      body: {
        name: "test",
        username: "test",
        password: "test",
      },
    };

    const userModel = {
      create: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue(req.body),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.create(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The username test already exists", status: 400 });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(userModel.find).toHaveBeenCalledWith({ state: true, username: "test" });
  });

  it("should return an error message in the response if the user is invalid", async () => {
    const req = {
      body: {
        password: "test",
      },
    };

    const userModel = {
      create: jest.fn().mockResolvedValue(null),
      find: jest.fn().mockResolvedValue(null),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user information is required", status: 400 });
    expect(userModel.create).not.toHaveBeenCalled();
  });

  it("should return an error message if the repository throws an error", async () => {
    const req = {
      body: {
        name: "test",
        username: "test",
        password: "test",
      },
    };

    const userModel = {
      create: jest.fn().mockRejectedValue(new Error("Error creating user")),
      find: jest.fn().mockResolvedValue(null),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error processing user: test", status: 400 });
    expect(userModel.create).toHaveBeenCalled();
  });
});

describe("Integrations - find one by id", () => {
  it("should find a user by id", async () => {
    const userFinded = {
      id: "test",
      name: "test",
      username: "test",
    };

    const req = {
      params: {
        id: "test",
      },
    };

    const userModel = {
      find: jest.fn().mockResolvedValue([userFinded]),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.findOneById(req, res);

    expect(userModel.find).toHaveBeenCalledWith({ _id: req.params.id, state: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user found", data: userFinded });
  });

  it("should return an error message if the user repository throws an error", async () => {
    const req = {
      params: {
        id: "test",
      },
    };

    const userModel = {
      find: jest.fn().mockRejectedValue(new Error("Error finding user")),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.findOneById(req, res);

    expect(userModel.find).toHaveBeenCalledWith({ _id: req.params.id, state: true });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: `Error processing user: ${req.params.id}`, status: 400 });
  });

  it("should return an error message if the user already exists", async () => {
    const req = {
      params: {
        id: "test",
      },
    };

    const userModel = {
      find: jest.fn().mockResolvedValue([null]),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.findOneById(req, res);

    expect(userModel.find).toHaveBeenCalledWith({ _id: req.params.id, state: true });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user not found", status: 404 });
  });
});

describe("Integrations - find one by username", () => {
  it("should find a user by username", async () => {
    const userFinded = {
      id: "test",
      name: "test",
      username: "test",
    };

    const req = {
      params: {
        username: "test",
      },
    };

    const userModel = {
      find: jest.fn().mockResolvedValue([userFinded]),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.findOneByUsername(req, res);

    expect(userModel.find).toHaveBeenCalledWith({ username: req.params.username, state: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user found", data: userFinded });
  });

  it("should return an error message if the user repository throws an error", async () => {
    const req = {
      params: {
        username: "test",
      },
    };

    const userModel = {
      find: jest.fn().mockRejectedValue(new Error("Error finding user")),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.findOneByUsername(req, res);

    expect(userModel.find).toHaveBeenCalledWith({ username: req.params.username, state: true });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: `Error processing user: ${req.params.username}`, status: 400 });
  });

  it("should return an error message if the user already exists", async () => {
    const req = {
      params: {
        username: "test",
      },
    };

    const userModel = {
      find: jest.fn().mockResolvedValue([null]),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.findOneByUsername(req, res);

    expect(userModel.find).toHaveBeenCalledWith({ username: req.params.username, state: true });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user not found", status: 404 });
  });
});

describe("Integrations - update user", () => {
  it("should update a user", async () => {
    const userUpdated = {
      id: "test",
      name: "test",
      username: "test",
    };

    const req = {
      params: {
        id: "test",
      },
      body: {
        name: "test",
        username: "test",
        password: "test",
      },
    };

    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(userUpdated),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.update(req, res);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user updated", data: userUpdated });
  });

  it("should return an error message if the user id is not valid", async () => {
    const req = {
      params: {
        id: null,
      },
      body: {
        name: "test",
        username: "test",
        password: "test",
      },
    };

    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.update(req, res);

    expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user information is required", status: 400 });
  });

  it("should return an error message if the user is not valid", async () => {
    const req = {
      params: {
        id: "test",
      },
      body: {
        name: null,
        username: null,
        password: "test",
      },
    };

    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.update(req, res);

    expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user information is required", status: 400 });
  });

  it("should return an error message if the user repository throws an error", async () => {
    const req = {
      params: {
        id: "test",
      },
      body: {
        name: "test",
        username: "test",
        password: "test",
      },
    };

    const userModel = {
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error("Error updating user")),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.update(req, res);

    // validate that have been called only with name, username and password
    expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: `Error processing user: ${req.params.id}`, status: 400 });
  });
});

describe("Integrations - delete user", () => {
  it("should delete a user", async () => {
    const userDeleted = {
      id: "test",
      name: "test",
      username: "test",
    };

    const req = {
      params: {
        id: "test",
      },
    };

    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(userDeleted),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.delete(req, res);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "user deleted", data: userDeleted });
  });

  it("should return an error message if the user repository throws an error", async () => {
    const req = {
      params: {
        id: "test",
      },
    };

    const userModel = {
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error("Error deleting user")),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel)));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await userController.delete(req, res);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error processing user: test", status: 400 });
  });
});
