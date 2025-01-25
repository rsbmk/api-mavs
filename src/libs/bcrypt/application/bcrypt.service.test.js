import { BcryptService } from "./bcrypt.service.js";

describe("BcryptService", () => {
  it("should compare two passwords", async () => {
    const mockBcrypt = {
      compare: jest.fn().mockReturnValue(true),
    };
    const bcryptService = new BcryptService(mockBcrypt);

    const result = await bcryptService.compare("test", "test");
    expect(result).toBe(true);
    expect(mockBcrypt.compare).toHaveBeenCalledWith("test", "test");
  });

  it("should hash a password", async () => {
    const mockBcrypt = {
      hash: jest.fn().mockReturnValue("hashedpassword"),
    };
    const bcryptService = new BcryptService(mockBcrypt);

    const result = await bcryptService.hash("test", "test");
    expect(result).toBe("hashedpassword");
    expect(mockBcrypt.hash).toHaveBeenCalledWith("test", "test");
  });

  it("should generate a salt", async () => {
    const mockBcrypt = {
      genSalt: jest.fn().mockReturnValue("salt"),
    };
    const bcryptService = new BcryptService(mockBcrypt);

    const result = await bcryptService.genSalt(10);
    expect(result).toBe("salt");
    expect(mockBcrypt.genSalt).toHaveBeenCalledWith(10);
  });

  it("should use the default rounds when the bcrypt service is not provided", async () => {
    const mockBcrypt = {
      genSalt: jest.fn().mockReturnValue(null),
    };
    const bcryptService = new BcryptService(mockBcrypt);

    const result = await bcryptService.genSalt(10);
    expect(result).toBe("10");
    expect(mockBcrypt.genSalt).toHaveBeenCalledWith(10);
  });
});
