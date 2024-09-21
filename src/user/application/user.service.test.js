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

    await expect(userService.create(user)).rejects.toThrow("The user information is required");
  });

  it("should throw an error when name is missing", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn(),
      save: jest.fn(),
    };
    const userService = new UserService(mockUserRepository);
    const user = { username: "testuser", password: "password123" };

    await expect(userService.create(user)).rejects.toThrow("The user information is required");
  });
});

describe("findOneById", () => {
  it("should retrieve user by valid id", async () => {
    const user = [{ id: "1", username: "testuser", name: "Test User" }];
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue(user),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneById("1");

    expect(mockUserRepository.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(expect.objectContaining(user[0]));
  });

  it("should return user object if found", async () => {
    const user = [{ id: "2", username: "anotheruser", name: "Another User" }];
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue(user),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneById("2");

    expect(result).toEqual(expect.objectContaining(user[0]));
  });

  it("should throw error if user not found", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue([null]),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneById("3")).rejects.toThrow("The user not found");
  });

  it("should throw error if repository findById method fails", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockRejectedValue(new Error("Repository error")),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneById("4")).rejects.toThrow("Error processing user: 4");
  });

  it("should handle null or undefined user object", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue([undefined]),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneById("5")).rejects.toThrow("The user not found");
  });

  it("should throw error if the id is invalid", async () => {
    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue(undefined),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneById()).rejects.toThrow("The user information is required");
  });
});

describe("findOneByUsername", () => {
  it("should retrieve a user by username when the user exists", async () => {
    const user = [{ id: "1", username: "testuser", name: "Test User" }];
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(user),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneByUsername("testuser");
    expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith("testuser");
    expect(result).toEqual(expect.objectContaining(user[0]));
  });

  it("should return the user object when found", async () => {
    const user = [{ id: "1", username: "testuser", name: "Test User" }];
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(user),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneByUsername("testuser");
    expect(result).toEqual(expect.objectContaining(user[0]));
  });

  it("should throw an error when the user is not found", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue([null]),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername("nonexistentuser")).rejects.toThrow("The user not found");
  });

  it("should throw an error when the repository method fails", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockRejectedValue(new Error("Repository error")),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername("testuser")).rejects.toThrow("Error processing user: testuser");
  });

  it("should handle empty or null username input", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername(null)).rejects.toThrow("The user information is required");
    await expect(userService.findOneByUsername("")).rejects.toThrow("The user information is required");
  });
});

describe("findOneByUsername", () => {
  it("should retrieve a user by username when the user exists", async () => {
    const user = [{ id: 1, username: "testuser" }];
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(user),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneByUsername("testuser");
    expect(result).toEqual(user[0]);
    expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith("testuser");
  });

  it("should return the user object when found by username", async () => {
    const user = [{ id: 2, username: "anotheruser" }];
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(user),
    };

    const userService = new UserService(mockUserRepository);
    const result = await userService.findOneByUsername("anotheruser");
    expect(result).toEqual(user[0]);
  });

  it("should throw an error when the user with the given username does not exist", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue([null]),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername("nonexistentuser")).rejects.toThrow("The user not found");
  });

  it("should throw an error when the repository call fails", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockRejectedValue(new Error("Repository error")),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername("testuser")).rejects.toThrow(`Error processing user: testuser`);
  });

  it("should handle empty or null username input", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
    };

    const userService = new UserService(mockUserRepository);
    await expect(userService.findOneByUsername(null)).rejects.toThrow("The user information is required");
    await expect(userService.findOneByUsername("")).rejects.toThrow("The user information is required");
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

    await expect(userService.update(null, user)).rejects.toThrow("The user information is required");
  });

  it("should throw error when user object is null or undefined", async () => {
    const userService = new UserService();

    await expect(userService.update("valid-id", null)).rejects.toThrow("The user information is required");
    await expect(userService.update("valid-id", undefined)).rejects.toThrow("The user information is required");
  });

  it("should throw error when user object has no name, username, or characters", async () => {
    const userService = new UserService();
    const user = {};

    await expect(userService.update("valid-id", user)).rejects.toThrow("The user information is required");
  });

  it("should throw error when the repository return null", async () => {
    const mockUserRepository = {
      update: jest.fn().mockResolvedValue(null),
    };

    const userService = new UserService(mockUserRepository);
    const id = "valid-id";
    const user = { name: "John Doe" };

    expect(userService.update(id, user)).rejects.toThrow("The user not found");
    expect(mockUserRepository.update).toHaveBeenCalledWith(id, user);
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

    await expect(userService.delete(id)).rejects.toThrow(`Error processing user: ${id}`);
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

    await expect(userService.delete(null)).rejects.toThrow("The user information is required");
    await expect(userService.delete(undefined)).rejects.toThrow("The user information is required");
  });

  it("should throw an error if the user not found", () => {
    const userRepository = {
      delete: jest.fn().mockResolvedValue(null),
    };
    const userService = new UserService(userRepository);
    const id = "valid-id";

    expect(userService.delete(id)).rejects.toThrow("The user not found");
    expect(userRepository.delete).toHaveBeenCalledWith(id);
    expect(userRepository.delete).toHaveBeenCalledTimes(1);
  });
});

describe("cleanPassword", () => {
  it("should remove password from user object", () => {
    const user = { id: "1", name: "John Doe", password: "secret" };
    const userService = new UserService();
    const result = userService.cleanPassword(user);
    expect(result).toEqual({ id: "1", name: "John Doe", password: undefined });
  });

  it("should return user object without password", () => {
    const user = { id: "1", name: "John Doe", password: "secret" };
    const userService = new UserService();
    const result = userService.cleanPassword(user);
    expect(result).toEqual({ id: "1", name: "John Doe" });
  });

  it("should handle user object without password property", () => {
    const user = { id: "1", name: "John Doe" };
    const userService = new UserService();
    const result = userService.cleanPassword(user);
    expect(result).toEqual({ id: "1", name: "John Doe" });
  });

  it("should handle user object with password set to null", () => {
    const user = { id: "1", name: "John Doe", password: null };
    const userService = new UserService();
    const result = userService.cleanPassword(user);
    expect(result).toEqual({ id: "1", name: "John Doe" });
  });

  it("should handle user object with password set to undefined", () => {
    const user = { id: "1", name: "John Doe", password: undefined };
    const userService = new UserService();
    const result = userService.cleanPassword(user);
    expect(result).toEqual({ id: "1", name: "John Doe" });
  });
});

describe("findUserByUsernameWithPassword", () => {
  it("should return user object when username exists", async () => {
    const user = [{ id: "1", username: "johndoe", password: "hashedpassword" }];
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(user),
    };
    const userService = new UserService(mockUserRepository);

    expect(await userService.findUserByUsernameWithPassword("johndoe")).toEqual(user[0]);
    expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith("johndoe");
  });

  it("should throw error when username does not exist", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue([null]),
    };
    const userService = new UserService(mockUserRepository);

    await expect(userService.findUserByUsernameWithPassword("nonexistentuser")).rejects.toThrow("The user not found");
    expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith("nonexistentuser");
  });

  it("should throw error when username is an empty string", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
    };
    const userService = new UserService(mockUserRepository);

    await expect(userService.findUserByUsernameWithPassword("")).rejects.toThrow("The user information is required");
    expect(mockUserRepository.findOneByUsername).not.toHaveBeenCalled();
  });

  it("should throw error when username is null or undefined", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockResolvedValue(null),
    };
    const userService = new UserService(mockUserRepository);

    await expect(userService.findUserByUsernameWithPassword(null)).rejects.toThrow("The user information is required");
    await expect(userService.findUserByUsernameWithPassword(undefined)).rejects.toThrow("The user information is required");
    expect(mockUserRepository.findOneByUsername).not.toHaveBeenCalled();
    expect(mockUserRepository.findOneByUsername).not.toHaveBeenCalled();
  });

  it("should throw error when UserRepository throws an unexpected error", async () => {
    const mockUserRepository = {
      findOneByUsername: jest.fn().mockRejectedValue(new Error("Unexpected error")),
    };
    const userService = new UserService(mockUserRepository);

    await expect(userService.findUserByUsernameWithPassword("johndoe")).rejects.toThrow("Error processing user: johndoe");
    expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith("johndoe");
  });
});
