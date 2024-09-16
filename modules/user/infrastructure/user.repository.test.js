import { UserRepository } from "./user.repository.js";

describe("save", () => {
  it("should save a valid user object to the database", async () => {
    const userModel = {
      create: jest.fn().mockResolvedValue({ name: "John Doe", email: "john.doe@example.com" }),
    };
    const userRepository = new UserRepository(userModel);
    const user = { name: "John Doe", email: "john.doe@example.com" };
    const result = await userRepository.save(user);

    expect(userModel.create).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it("should save a valid user object to the database", async () => {
    const userModel = {
      create: jest.fn().mockResolvedValue({ name: "John Doe", email: "john.doe@example.com" }),
    };
    const userRepository = new UserRepository(userModel);
    const user = { name: "John Doe", email: "john.doe@example.com" };
    const result = await userRepository.save(user);

    expect(userModel.create).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it("should return a promise that resolves to the saved user object", async () => {
    const userModel = {
      create: jest.fn().mockResolvedValue({ name: "Jane Doe", email: "jane.doe@example.com" }),
    };
    const userRepository = new UserRepository(userModel);
    const user = { name: "Jane Doe", email: "jane.doe@example.com" };
    const result = await userRepository.save(user);

    expect(result).toEqual(user);
  });

  it("should handle saving a user object with missing optional fields", async () => {
    const userModel = {
      create: jest.fn().mockResolvedValue({ name: "John Doe" }),
    };
    const userRepository = new UserRepository(userModel);
    const user = { name: "John Doe" };
    const result = await userRepository.save(user);

    expect(userModel.create).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it("should manage saving a user object with additional unexpected fields", async () => {
    const userModel = {
      create: jest.fn().mockResolvedValue({ name: "John Doe", email: "john.doe@example.com", age: 30 }),
    };
    const userRepository = new UserRepository(userModel);
    const user = { name: "John Doe", email: "john.doe@example.com", age: 30 };
    const result = await userRepository.save(user);

    expect(userModel.create).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it("should handle saving a user object with null or undefined values", async () => {
    const userModel = {
      create: jest.fn().mockResolvedValue({ name: null, email: undefined }),
    };
    const userRepository = new UserRepository(userModel);
    const user = { name: null, email: undefined };
    const result = await userRepository.save(user);

    expect(userModel.create).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });
});

describe("findById", () => {
  it("should return a user object when a valid ID with state true is provided", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue({ _id: "validId", state: true, name: "John Doe" }),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findById("validId");

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: "validId", state: true });
    expect(result).toEqual({ _id: "validId", state: true, name: "John Doe" });
  });

  it("should return null when no user matches the provided ID with state true", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findById("nonExistentId");

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: "nonExistentId", state: true });
    expect(result).toBeNull();
  });

  it("should handle invalid ID formats gracefully", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findById("invalidFormat");

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: "invalidFormat", state: true });
    expect(result).toBeNull();
  });

  it("should return null when the user with the given ID has state false", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findById("validIdWithStateFalse");

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: "validIdWithStateFalse", state: true });
    expect(result).toBeNull();
  });
});

describe("findOneByUsername", () => {
  it("should return user object when username exists and state is true", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue({ username: "existingUser", state: true }),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername("existingUser");

    expect(userModel.findOne).toHaveBeenCalledWith({ username: "existingUser", state: true });
    expect(result).toEqual({ username: "existingUser", state: true });
  });

  it("should return null when username does not exist", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername("nonExistentUser");

    expect(userModel.findOne).toHaveBeenCalledWith({ username: "nonExistentUser", state: true });
    expect(result).toBeNull();
  });

  it("should return null when username is an empty string", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername("");

    expect(userModel.findOne).toHaveBeenCalledWith({ username: "", state: true });
    expect(result).toBeNull();
  });

  it("should return null when username contains special characters", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername("user!@#");

    expect(userModel.findOne).toHaveBeenCalledWith({ username: "user!@#", state: true });
    expect(result).toBeNull();
  });

  it("should return null when username is a very long string", async () => {
    const longUsername = "a".repeat(256);
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername(longUsername);

    expect(userModel.findOne).toHaveBeenCalledWith({ username: longUsername, state: true });
    expect(result).toBeNull();
  });
});

describe("findOneByUsername", () => {
  it("should return user object when username exists and state is true", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue({ username: "existingUser", state: true }),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername("existingUser");

    expect(userModel.findOne).toHaveBeenCalledWith({ username: "existingUser", state: true });
    expect(result).toEqual({ username: "existingUser", state: true });
  });

  it("should return null when username does not exist", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername("nonExistentUser");

    expect(userModel.findOne).toHaveBeenCalledWith({ username: "nonExistentUser", state: true });
    expect(result).toBeNull();
  });

  it("should return null when username is an empty string", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername("");

    expect(userModel.findOne).toHaveBeenCalledWith({ username: "", state: true });
    expect(result).toBeNull();
  });

  it("should return null when username contains special characters", async () => {
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername("user!@#");

    expect(userModel.findOne).toHaveBeenCalledWith({ username: "user!@#", state: true });
    expect(result).toBeNull();
  });

  it("should return null when username is a very long string", async () => {
    const longUsername = "a".repeat(256);
    const userModel = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const result = await userRepository.findOneByUsername(longUsername);

    expect(userModel.findOne).toHaveBeenCalledWith({ username: longUsername, state: true });
    expect(result).toBeNull();
  });
});

describe("update", () => {
  it("should update user when id and user data are valid", async () => {
    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue({ name: "John Doe", username: "johndoe", characters: [], updateAt: new Date() }),
    };
    const userRepository = new UserRepository(userModel);
    const id = "validId";
    const user = { name: "John Doe", username: "johndoe", characters: [] };
    const result = await userRepository.update(id, user);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { ...user, updateAt: expect.any(Date) }, { new: true });
    expect(result).toEqual({ name: "John Doe", username: "johndoe", characters: [], updateAt: expect.any(Date) });
  });

  it("should return updated user object after successful update", async () => {
    const updatedUser = { name: "Jane Doe", username: "janedoe", characters: [], updateAt: new Date() };
    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(updatedUser),
    };
    const userRepository = new UserRepository(userModel);
    const id = "validId";
    const user = { name: "Jane Doe", username: "janedoe", characters: [] };
    const result = await userRepository.update(id, user);

    expect(result).toEqual(updatedUser);
  });

  it("should handle error when id is invalid", async () => {
    const userModel = {
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error("Invalid ID")),
    };
    const userRepository = new UserRepository(userModel);
    const id = "invalidId";
    const user = { name: "John Doe", username: "johndoe", characters: [] };

    await expect(userRepository.update(id, user)).rejects.toThrow("Invalid ID");
  });

  it("should handle missing fields in user object", async () => {
    const updatedUser = { name: "John Doe", username: undefined, characters: [], updateAt: new Date() };
    const user = { name: "John Doe", characters: [] };
    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(updatedUser),
    };
    const userRepository = new UserRepository(userModel);
    const id = "validId";

    const result = await userRepository.update(id, user);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { ...user, updateAt: expect.any(Date) }, { new: true });
    expect(result).toEqual(updatedUser);
  });

  it("should handle null or undefined user object", async () => {
    const userModel = {
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error("User object is null or undefined")),
    };
    const userRepository = new UserRepository(userModel);
    const id = "validId";

    await expect(userRepository.update(id, null)).rejects.toThrow("User object is null or undefined");
    await expect(userRepository.update(id, undefined)).rejects.toThrow("User object is null or undefined");
  });
});

describe("delete", () => {
  it("should mark user as deleted by setting state to false when valid ID is provided", async () => {
    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue({ state: false, deleteAt: new Date() }),
    };
    const userRepository = new UserRepository(userModel);
    const id = "validUserId";
    const result = await userRepository.delete(id);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { state: false, deleteAt: expect.any(Date) }, { new: true });
    expect(result.state).toBe(false);
  });

  it("should update deleteAt field with current date and time when valid ID is provided", async () => {
    const currentDate = new Date();
    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue({ state: false, deleteAt: currentDate }),
    };
    const userRepository = new UserRepository(userModel);
    const id = "validUserId";
    const result = await userRepository.delete(id);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { state: false, deleteAt: expect.any(Date) }, { new: true });
    expect(result.deleteAt).toEqual(currentDate);
  });

  it("should return null when user ID does not exist in the database", async () => {
    const userModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };
    const userRepository = new UserRepository(userModel);
    const id = "nonExistentUserId";
    const result = await userRepository.delete(id);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { state: false, deleteAt: expect.any(Date) }, { new: true });
    expect(result).toBeNull();
  });

  it("should throw an error when user ID is null or undefined", async () => {
    const userModel = {
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error("Invalid ID")),
    };
    const userRepository = new UserRepository(userModel);

    await expect(userRepository.delete(null)).rejects.toThrow();
    await expect(userRepository.delete(undefined)).rejects.toThrow();
  });

  it("should throw an error when user ID is in an invalid format", async () => {
    const userModel = {
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error("Invalid ID")),
    };
    const userRepository = new UserRepository(userModel);
    const invalidId = "invalidFormatId";

    await expect(userRepository.delete(invalidId)).rejects.toThrow();
  });
});
