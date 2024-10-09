import { LikeService } from "../application/like.service.js";
import { LikeController } from "./like.controller.js";
import { LikeRepository } from "./like.repository.js";

describe("Integrations - like controller - create", () => {
  it("should create a like", async () => {
    const likeCreated = {
      characterId: 30,
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "like-id",
    };

    const likeModel = {
      create: jest.fn().mockResolvedValue(likeCreated),
      find: jest.fn().mockResolvedValue([]),
      findByIdAndUpdate: jest.fn(),
    };

    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));

    const req = {
      userId: likeCreated.userId,
      body: {
        characterId: likeCreated.characterId,
        userId: likeCreated.userId,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await likeController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Like created",
      data: likeCreated,
    });
    expect(likeModel.create).toHaveBeenCalledWith({
      characterId: likeCreated.characterId,
      userId: likeCreated.userId,
    });
  });

  it("should return an error message in the response body if characterId or userId are not provided", async () => {
    const req = { userId: "userId-test", body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository()));

    await likeController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The characterId and userId are required",
      status: 400,
    });
  });

  it("should return like already exists in the response body", async () => {
    const likeCreated = {
      characterId: 30,
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "like-id",
    };

    const likeModel = {
      create: jest.fn(),
      find: jest.fn().mockResolvedValue([likeCreated]),
      findByIdAndUpdate: jest.fn(),
    };

    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));

    const req = {
      userId: likeCreated.userId,
      body: {
        characterId: likeCreated.characterId,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await likeController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Like created",
      success: true,
      data: likeCreated,
    });
    expect(likeModel.create).not.toHaveBeenCalledWith({
      characterId: likeCreated.characterId,
      userId: likeCreated.userId,
    });
  });

  it("should return an error message in the response body if the user repository throws an error", async () => {
    const req = {
      userId: "userId-test",
      body: {
        characterId: 30,
        userId: "userId-test",
      },
    };
    const likeModel = {
      create: jest.fn().mockRejectedValue(new Error("Error creating like")),
      find: jest.fn().mockResolvedValue([]),
      findByIdAndUpdate: jest.fn(),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await likeController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 400,
      message: `Error creating like, for characterId: ${req.body.characterId} and userId: ${req.body.userId}`,
    });
    expect(likeModel.create).toHaveBeenCalledWith({
      characterId: req.body.characterId,
      userId: req.body.userId,
    });
  });
});

describe("Integrations - like controller - findByCharacterAndUserId", () => {
  it("should find all likes by character id", async () => {
    const likefinded = {
      characterId: 30,
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "like-id",
    };
    const likeModel = {
      countDocuments: jest.fn().mockResolvedValue(10),
      find: jest.fn().mockResolvedValue([likefinded]),
    };

    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));

    const req = {
      userId: "userId-test",
      params: {
        characterId: 30,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await likeController.findByCharacterAndUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Likes found",
      data: {
        total: 10,
        ...likefinded,
      },
    });
    expect(likeModel.countDocuments).toHaveBeenCalledWith({ characterId: 30, state: true });
  });

  it("should return an error message in the response body if characterId is not provided", async () => {
    const req = { params: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository()));

    await likeController.findByCharacterAndUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The characterId and userId are required",
      status: 400,
    });
  });

  it("should return an error message in the response body if the like repository throws an error", async () => {
    const req = {
      userId: "userId-test",
      params: {
        characterId: 30,
      },
    };
    const likeModel = {
      countDocuments: jest.fn().mockRejectedValue(new Error()),
      find: jest.fn(),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await likeController.findByCharacterAndUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error finding like, for characterId: 30",
      status: 400,
    });
    expect(likeModel.countDocuments).toHaveBeenCalledWith({ characterId: 30, state: true });
  });
});

describe("Integrations - like controller - findAllByUserId", () => {
  it("should find all likes by user id", async () => {
    const likes = [
      {
        characterId: 30,
        userId: "userId-test",
        state: true,
        deleteAt: null,
        createAt: "2024-09-17T04:03:27.539Z",
        updateAt: "2024-09-17T04:03:27.539Z",
        id: "like-id",
      },
    ];
    const likeModel = {
      find: jest.fn().mockResolvedValue(likes),
      countDocuments: jest.fn(),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));

    const req = {
      userId: "userId-test",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await likeController.findAllByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Likes found",
      data: likes,
    });
    expect(likeModel.find).toHaveBeenCalledWith({ userId: "userId-test", state: true });
  });

  it("should catch the error when the counts likes throw an error", async () => {
    const likes = [
      {
        characterId: 30,
        userId: "userId-test",
        state: true,
        deleteAt: null,
        createAt: "2024-09-17T04:03:27.539Z",
        updateAt: "2024-09-17T04:03:27.539Z",
        id: "like-id",
      },
    ];
    const likeModel = {
      find: jest.fn().mockResolvedValue(likes),
      countDocuments: jest.fn().mockRejectedValue(new Error()),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));

    const req = {
      userId: "userId-test",
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await likeController.findAllByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error finding like, for userId: userId-test",
      status: 400,
      success: false,
    });
    expect(likeModel.find).toHaveBeenCalledWith({ userId: "userId-test", state: true });
  });

  it("should return an error message in the response body if userId is not provided", async () => {
    const req = { params: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository()));
    await likeController.findAllByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  });

  it("should return an error message in the response body if the like repository throws an error", async () => {
    const req = {
      userId: "userId-test",
    };
    const likeModel = {
      find: jest.fn().mockRejectedValue(new Error("Failed to find likes")),
      findByIdAndUpdate: jest.fn(),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await likeController.findAllByUserId(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: `Error finding like, for userId: ${req.userId}`,
      status: 400,
    });
    expect(likeModel.find).toHaveBeenCalledWith({ userId: "userId-test", state: true });
  });
});

describe("Integrations - like controller - delete", () => {
  it("should delete a like by id", async () => {
    const commentDeleted = {
      characterId: 30,
      userId: "userId-test",
      state: false,
      deleteAt: new Date(),
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "like-id",
    };
    const likeModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(commentDeleted),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));
    const req = {
      params: {
        id: "like-id",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await likeController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Like deleted",
      data: commentDeleted,
    });
    expect(likeModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it("should return an error message in the response body if id is not provided", async () => {
    const req = { params: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockLikeModel = {
      findByIdAndUpdate: jest.fn(),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(mockLikeModel)));
    await likeController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The commentId is required",
      status: 400,
    });
  });

  it("should return an error message in the response body if the like repository throws an error", async () => {
    const req = {
      params: {
        id: "like-id",
      },
    };
    const likeModel = {
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error("Failed to delete like")),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await likeController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 400,
      message: `Error deleting like, for id: ${req.params.id}`,
    });
    expect(likeModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it("should return an error message if the like it is not found", async () => {
    const req = {
      params: {
        id: "like-id",
      },
    };
    const likeModel = {
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
    };
    const likeController = new LikeController(new LikeService(new LikeRepository(likeModel)));
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await likeController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: 404,
      message: `Like not found, for id: ${req.params.id}`,
    });
    expect(likeModel.findByIdAndUpdate).toHaveBeenCalled();
  });
});
