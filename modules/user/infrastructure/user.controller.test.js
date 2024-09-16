import { UserController } from "./user.controller.js";

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

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Missing required fields" });
  });

  it("should handle invalid data types for name, username, or password", async () => {
    const req = { body: { name: 12345, username: true, password: {} } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { create: jest.fn().mockRejectedValue(new Error("Invalid data types")) };

    const controller = new UserController(userService);
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid data types" });
  });

  it("should handle empty request body", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { create: jest.fn().mockRejectedValue(new Error("Empty request body")) };

    const controller = new UserController(userService);
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Empty request body" });
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
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "User not found" });
  });

  it("should return 404 status code when user ID is not provided", async () => {
    const req = { params: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { findOneById: jest.fn().mockRejectedValue(new Error("User not found")) };

    const controller = new UserController(userService);
    await controller.findOneById(req, res);

    expect(userService.findOneById).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "User not found" });
  });

  it("should return 404 status code when user ID is invalid or malformed", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userService = { findOneById: jest.fn().mockRejectedValue(new Error("User not found")) };

    const controller = new UserController(userService);
    await controller.findOneById(req, res);

    expect(userService.findOneById).toHaveBeenCalledWith("invalid-id");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "User not found" });
  });
});
