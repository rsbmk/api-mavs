import { UserService } from "../application/user.service.js";
import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository.js";
/**
 * Integrations tests
 */

describe("Integrations - create user", () => {
  it("should create a new user", async () => {
    const userModel = {
      create: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };

    const mockBcrypt = {
      hash: jest.fn().mockResolvedValue("hashedpassword"),
      genSalt: jest.fn().mockResolvedValue("salt"),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel), mockBcrypt));

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
      find: jest.fn().mockResolvedValue([req.body]),
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
      find: jest.fn().mockResolvedValue([]),
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
      find: jest.fn().mockResolvedValue([]),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };

    const mockBcrypt = {
      hash: jest.fn().mockResolvedValue("hashedpassword"),
      genSalt: jest.fn().mockResolvedValue("salt"),
      compare: jest.fn().mockResolvedValue(true),
    };

    const userController = new UserController(new UserService(new UserRepository(userModel), mockBcrypt));

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

  it("shoul reutnr an error if the is an invalid user id", async () => {
    const req = {
      params: {
        id: null,
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

    expect(userModel.find).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user information is required", status: 400 });
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

  it("should return an error message if the username is not provider", async () => {
    const req = {
      params: {
        username: null,
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

    expect(userModel.find).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user information is required", status: 400 });
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

  it("should return an error message if the user not found", async () => {
    const req = {
      params: {
        id: "test",
      },
      body: {
        name: "test",
        username: "test",
        // password: "test",
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

    expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user not found", status: 404 });
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

  it("should return an error message if the user is not found", async () => {
    const req = {
      params: {
        id: "test",
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

    await userController.delete(req, res);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user not found", status: 404 });
  });

  it("should return an error message if the user id is not provider", async () => {
    const req = {
      params: {
        id: null,
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

    await userController.delete(req, res);

    expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "The user information is required", status: 400 });
  });
});

describe("Integrations - find user by username with password", () => {
  it("should find a user by username with password", async () => {
    const user = {
      id: "test",
      name: "test",
      username: "test",
      password: "test",
    };

    const userModel = {
      find: jest.fn().mockResolvedValue([user]),
    };

    const userService = new UserService(new UserRepository(userModel));

    const userFound = await userService.findUserByUsernameWithPassword(user.username);

    expect(userModel.find).toHaveBeenCalledWith({ username: user.username, state: true });
    expect(userFound).toEqual(user);
  });

  it("should throw an error if the username ara invalid", async () => {
    const userModel = {
      find: jest.fn().mockResolvedValue([]),
    };

    const userService = new UserService(new UserRepository(userModel));

    expect(userModel.find).not.toHaveBeenCalled();
    expect(userService.findUserByUsernameWithPassword()).rejects.toThrow("The user information is required");
    expect(userService.findUserByUsernameWithPassword(null)).rejects.toThrow("The user information is required");
    expect(userService.findUserByUsernameWithPassword("")).rejects.toThrow("The user information is required");
  });

  it("should receive an error if the user repository throw an error", async () => {
    const user = {
      username: "test",
    };
    const userModel = {
      find: jest.fn().mockRejectedValue(new Error()),
    };

    const userService = new UserService(new UserRepository(userModel));
    expect(userService.findUserByUsernameWithPassword(user.username)).rejects.toThrow(`Error processing user: ${user.username}`);
  });

  it("should receive an error if the user not found", async () => {
    const user = {
      username: "test",
    };

    const userModel = {
      find: jest.fn().mockResolvedValue([]),
    };

    const userService = new UserService(new UserRepository(userModel));
    expect(userService.findUserByUsernameWithPassword(user.username)).rejects.toThrow("The user not found");
  });
});
