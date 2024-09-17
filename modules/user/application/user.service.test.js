import { UserService } from "./user.service";
import bcrypt from "bcrypt";

describe("create", () => {
  it("should create a user when valid data is provided", async () => {
    const user = { id: "1", username: "testuser", name: "Test User", password: "password123" };

    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({ id: user.id, username: user.username, name: user.name, password: "hashedpassword" }),
    };
    const userService = new UserService(mockUserRepository);

    const result = await userService.create(user);

    expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith(user.username);
    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({ username: user.username, name: user.name }));
    expect(result).toEqual(expect.objectContaining({ id: user.id, username: user.username, name: user.name }));
  });

  it("should generate a salt and hash the password correctly", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({ id: "1", username: "testuser", name: "Test User", password: "hashedpassword" }),
    };
    const userService = new UserService(mockUserRepository);
    const user = { username: "testuser", name: "Test User", password: "password123" };

    const saltSpy = jest.spyOn(bcrypt, "genSalt").mockResolvedValue("salt");
    const hashSpy = jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedpassword");

    await userService.create(user);

    expect(saltSpy).toHaveBeenCalledWith(10);
    expect(hashSpy).toHaveBeenCalledWith("password123", "salt");
  });

  it("should throw an error when username is missing", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn(),
      save: jest.fn(),
    };
    const userService = new UserService(mockUserRepository);
    const user = { name: "Test User", password: "password123" };

    await expect(userService.create(user)).rejects.toThrow("username, password and name are required");
  });

  it("should throw an error when name is missing", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn(),
      save: jest.fn(),
    };
    const userService = new UserService(mockUserRepository);
    const user = { username: "testuser", password: "password123" };

    await expect(userService.create(user)).rejects.toThrow("username, password and name are required");
  });
});

describe("findOneById", () => {
  it("should retrieve user by valid id", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue({ id: "1", username: "testuser", name: "Test User" }),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneById("1");

    expect(mockUserRepository.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(expect.objectContaining({ id: "1", username: "testuser", name: "Test User" }));
  });

  it("should return user object if found", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue({ id: "2", username: "anotheruser", name: "Another User" }),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneById("2");

    expect(result).toEqual(expect.objectContaining({ id: "2", username: "anotheruser", name: "Another User" }));
  });

  it("should throw error if user not found", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneById("3")).rejects.toThrow("User with id 3 not found");
  });

  it("should throw error if repository findById method fails", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockRejectedValue(new Error("Repository error")),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneById("4")).rejects.toThrow("Error finding user with id 4");
  });

  it("should handle null or undefined user object", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue(undefined),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneById("5")).rejects.toThrow("User with id 5 not found");
  });
});

describe("findOneByUsername", () => {
  it("should retrieve a user by username when the user exists", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue({ id: "1", username: "testuser", name: "Test User" }),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneByUsername("testuser");
    expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith("testuser");
    expect(result).toEqual(expect.objectContaining({ id: "1", username: "testuser", name: "Test User" }));
  });

  it("should return the user object when found", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue({ id: "1", username: "testuser", name: "Test User" }),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneByUsername("testuser");
    expect(result).toEqual(expect.objectContaining({ id: "1", username: "testuser", name: "Test User" }));
  });

  it("should throw an error when the user is not found", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername("nonexistentuser")).rejects.toThrow("User with username nonexistentuser not found");
  });

  it("should throw an error when the repository method fails", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockRejectedValue(new Error("Repository error")),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername("testuser")).rejects.toThrow("Error finding user with username testuser");
  });

  it("should handle empty or null username input", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername(null)).rejects.toThrow("User with username null not found");
    await expect(userService.findOneByUsername("")).rejects.toThrow("User with username  not found");
  });
});

describe("findOneByUsername", () => {
  it("should retrieve a user by username when the user exists", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue({ id: 1, username: "testuser" }),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneByUsername("testuser");
    expect(result).toEqual({ id: 1, username: "testuser" });
    expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith("testuser");
  });

  it("should return the user object when found by username", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue({ id: 2, username: "anotheruser" }),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneByUsername("anotheruser");
    expect(result).toEqual({ id: 2, username: "anotheruser" });
  });

  it("should throw an error when the user with the given username does not exist", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername("nonexistentuser")).rejects.toThrow("User with username nonexistentuser not found");
  });

  it("should throw an error when the repository call fails", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockRejectedValue(new Error("Repository error")),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername("testuser")).rejects.toThrow("Error finding user with username testuser");
  });

  it("should handle empty or null username input", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername(null)).rejects.toThrow("User with username null not found");
    await expect(userService.findOneByUsername("")).rejects.toThrow("User with username  not found");
  });
});

describe("update", () => {
  it("should successfully update user when valid id and user data are provided", async () => {
    const user = { name: "John Doe" };
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue(user),
    };
    const userService = new UserService(mockUserRepository);
    const id = "valid-id";

    expect(await userService.update(id, user)).toEqual(user);
    expect(mockUserRepository.update).toHaveBeenCalledWith(id, user);
  });

  it("should handle update when only name is provided", async () => {
    const user = { name: "John Doe" };
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue(user),
    };
    const userService = new UserService(mockUserRepository);
    const id = "valid-id";

    expect(await userService.update(id, user)).toEqual(user);
    expect(mockUserRepository.update).toHaveBeenCalledWith(id, user);
  });

  it("should throw error when id is not provided", async () => {
    const userService = new UserService();
    const user = { name: "John Doe" };

    await expect(userService.update(null, user)).rejects.toThrow("id is required");
  });

  it("should throw error when user object is null or undefined", async () => {
    const userService = new UserService();

    await expect(userService.update("valid-id", null)).rejects.toThrow("name, username or characters are required");
    await expect(userService.update("valid-id", undefined)).rejects.toThrow("name, username or characters are required");
  });

  it("should throw error when user object has no name, username, or characters", async () => {
    const userService = new UserService();
    const user = {};

    await expect(userService.update("valid-id", user)).rejects.toThrow("name, username or characters are required");
  });
});

describe("delete", () => {
  it("should delete a user when a valid id is provided", async () => {
    const userDeleted = { id: "valid-id", name: "John Doe", username: "johndoe" };
    const userRepository = { delete: jest.fn().mockResolvedValue(userDeleted) };
    const userService = new UserService(userRepository);

    expect(await userService.delete(userDeleted.id)).toEqual(userDeleted);
    expect(userRepository.delete).toHaveBeenCalledWith(userDeleted.id);
  });

  it("should throw an error if userRepository.delete fails", async () => {
    const userRepository = { delete: jest.fn().mockRejectedValue(new Error("Delete failed")) };
    const userService = new UserService(userRepository);
    const id = "valid-id";

    await expect(userService.delete(id)).rejects.toThrow(`Error deleting user with id ${id}`);
  });

  it("should handle non-existent user id gracefully", async () => {
    const userRepository = { delete: jest.fn().mockResolvedValue({}) };
    const userService = new UserService(userRepository);
    const id = "non-existent-id";

    expect(await userService.delete(id)).toEqual({});
    expect(userRepository.delete).toHaveBeenCalledWith(id);
    expect(userRepository.delete).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if id is null or undefined", async () => {
    const userRepository = {
      delete: jest.fn().mockRejectedValue(new Error("Error deleting user with id null")),
    };
    const userService = new UserService(userRepository);

    await expect(userService.delete(null)).rejects.toThrow("Error deleting user with id null");
    await expect(userService.delete(undefined)).rejects.toThrow("Error deleting user with id undefined");
  });
});
