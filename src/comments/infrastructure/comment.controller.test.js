import { CommentService } from "../application/comment.service.js";
import { CommentController } from "./comment.controller.js";
import { CommentRepository } from "./comment.repository.js";

describe("Integrations - comment controller - create", () => {
  it("should create a comment", async () => {
    const commentCreated = {
      characterId: 30,
      comment: "This is a comment",
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "comment-id",
    };

    const commentModel = {
      create: jest.fn().mockResolvedValue(commentCreated),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      userId: commentCreated.userId,
      body: {
        characterId: commentCreated.characterId,
        comment: commentCreated.comment,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "comment created",
      data: commentCreated,
    });
    expect(commentModel.create).toHaveBeenCalledWith({
      characterId: commentCreated.characterId,
      comment: commentCreated.comment,
      userId: commentCreated.userId,
    });
  });

  it("should return an error if userId is not provided", async () => {
    const commentCreated = {
      characterId: 30,
      comment: "This is a comment",
      userId: null,
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "comment-id",
    };

    const commentModel = {
      create: jest.fn().mockResolvedValue(commentCreated),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      userId: commentCreated.userId,
      body: {
        characterId: commentCreated.characterId,
        comment: commentCreated.comment,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The userId is required",
      status: 400,
    });
    expect(commentModel.create).not.toHaveBeenCalled();
  });

  it("should return an error if characterId is not provided", async () => {
    const commentCreated = {
      characterId: null,
      comment: "This is a comment",
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "comment-id",
    };

    const commentModel = {
      create: jest.fn().mockResolvedValue(commentCreated),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      userId: commentCreated.userId,
      body: {
        characterId: commentCreated.characterId,
        comment: commentCreated.comment,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The comment and characterId is required",
      status: 400,
    });
    expect(commentModel.create).not.toHaveBeenCalled();
  });

  it("should return an error if comment is not provided", async () => {
    const commentCreated = {
      characterId: 30,
      comment: null,
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "comment-id",
    };

    const commentModel = {
      create: jest.fn().mockResolvedValue(commentCreated),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      userId: commentCreated.userId,
      body: {
        characterId: commentCreated.characterId,
        comment: commentCreated.comment,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The comment and characterId is required",
      status: 400,
    });
    expect(commentModel.create).not.toHaveBeenCalled();
  });

  it("should return an error if comment repository throws an error", async () => {
    const commentCreated = {
      characterId: 30,
      comment: "This is a comment",
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "comment-id",
    };

    const commentModel = {
      create: jest.fn().mockRejectedValue(new Error()),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      userId: commentCreated.userId,
      body: {
        characterId: commentCreated.characterId,
        comment: commentCreated.comment,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Transaction failed",
      status: 422,
    });
    expect(commentModel.create).toHaveBeenCalled();
    expect(commentModel.create).toHaveBeenCalledWith({ ...req.body, userId: req.userId });
  });
});

describe("Integration - comments controller - findAllByCharacterId", () => {
  it("should find all comments by character id", async () => {
    const comments = [
      {
        characterId: 30,
        comment: "This is a comment",
        userId: "userId-test",
        state: true,
        deleteAt: null,
        createAt: "2024-09-17T04:03:27.539Z",
        updateAt: "2024-09-17T04:03:27.539Z",
        id: "comment-id",
      },
    ];

    const commentModel = {
      create: jest.fn(),
      find: jest.fn().mockResolvedValue(comments),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        characterId: 30,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.findAllByCharacterId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "comments found",
      data: comments,
    });
    expect(commentModel.find).toHaveBeenCalledWith({ characterId: 30, state: true });
  });

  it("should return an error if character id is not provided", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        characterId: null,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.findAllByCharacterId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The characterId is required",
      status: 400,
    });
    expect(commentModel.find).not.toHaveBeenCalled();
  });

  it("should return an error if comment repository throws an error", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn().mockRejectedValue(new Error()),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        characterId: 30,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.findAllByCharacterId(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Transaction failed",
      status: 422,
    });
    expect(commentModel.find).toHaveBeenCalledWith({ characterId: 30, state: true });
  });
});

describe("Integration - comments controller - findAllByUserId", () => {
  it("should find all comments by user id", async () => {
    const comments = [
      {
        characterId: 30,
        comment: "This is a comment",
        userId: "userId-test",
        state: true,
        deleteAt: null,
        createAt: "2024-09-17T04:03:27.539Z",
        updateAt: "2024-09-17T04:03:27.539Z",
        id: "comment-id",
      },
    ];

    const commentModel = {
      create: jest.fn(),
      find: jest.fn().mockResolvedValue(comments),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        userId: "userId-test",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.findAllByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "comments found",
      data: comments,
    });
    expect(commentModel.find).toHaveBeenCalledWith({ userId: "userId-test", state: true });
  });

  it("should return an error if user id is not provided", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        userId: null,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.findAllByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The userId is required",
      status: 400,
    });
    expect(commentModel.find).not.toHaveBeenCalled();
  });

  it("should return an error if comment repository throws an error", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn().mockRejectedValue(new Error()),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        userId: "userId-test",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.findAllByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Transaction failed",
      status: 422,
    });
    expect(commentModel.find).toHaveBeenCalledWith({ userId: "userId-test", state: true });
  });

  it("should return an error if comment repository throws an error", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn().mockRejectedValue(new Error()),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        userId: "userId-test",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.findAllByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Transaction failed",
      status: 422,
    });
    expect(commentModel.find).toHaveBeenCalledWith({ userId: "userId-test", state: true });
  });
});

describe("Integration - comments controller - update", () => {
  it("should update a comment", async () => {
    const updatedComment = {
      characterId: 30,
      comment: "This is a comment",
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "comment-id",
    };

    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn().mockResolvedValue(updatedComment),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        id: "comment-id",
      },
      body: {
        comment: "This is a comment",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "comment updated",
      data: updatedComment,
    });
    expect(commentModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it("should return an error if the comment id is not provided", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        id: null,
      },
      body: {
        comment: "This is a comment",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The commentId is required",
      status: 400,
    });
    expect(commentModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should return an error if the comment is not provided", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        id: "comment-id",
      },
      body: {
        comment: null,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The comment is required",
      status: 400,
    });
    expect(commentModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should return an error if comment repository throws an error", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error()),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        id: "comment-id",
      },
      body: {
        comment: "This is a comment",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Transaction failed",
      status: 422,
    });
    expect(commentModel.findByIdAndUpdate).toHaveBeenCalled();
  });
});

describe("Integration - comments controller - delete", () => {
  it("should delete a comment", async () => {
    const deletedComment = {
      characterId: 30,
      comment: "This is a comment",
      userId: "userId-test",
      state: true,
      deleteAt: null,
      createAt: "2024-09-17T04:03:27.539Z",
      updateAt: "2024-09-17T04:03:27.539Z",
      id: "comment-id",
    };

    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn().mockResolvedValue(deletedComment),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        id: "comment-id",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "comment deleted",
      data: deletedComment,
    });
    expect(commentModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it("should return an error if comment id is not provided", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        id: null,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "The commentId is required",
      status: 400,
    });
    expect(commentModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should return an error if comment repository throws an error", async () => {
    const commentModel = {
      create: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error()),
    };

    const commentController = new CommentController(new CommentService(new CommentRepository(commentModel)));

    const req = {
      params: {
        id: "comment-id",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await commentController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Transaction failed",
      status: 422,
    });
    expect(commentModel.findByIdAndUpdate).toHaveBeenCalled();
  });
});
