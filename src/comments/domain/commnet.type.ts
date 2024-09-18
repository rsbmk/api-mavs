export type Comment = {
  characterId: number;
  comment: string;
  userId: string;
  state: boolean;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date | null;
  id: string;
};

export type CreateCommentDTO = Pick<Comment, "characterId" | "comment" | "userId">;

export type ICommentRespository = {
  create: (comment: CreateCommentDTO) => Promise<Comment>;
  findAllByCharacterId: (characterId: number) => Promise<Comment[]>;
  findAllByUserId: (userId: string) => Promise<Comment[]>;
  update: (id: string, comment: Partial<Comment>) => Promise<Comment | null>;
};

export type ICommentService = {
  create: (userId: string, comment: CreateCommentDTO) => Promise<Comment>;
  findAllByCharacterId: (characterId: number) => Promise<Comment[]>;
  findAllByUserId: (userId: string) => Promise<Comment[]>;
  update: (id: string, comment: Partial<Comment>) => Promise<Comment | null>;
  delete: (id: string) => Promise<Comment | null>;
};

export type ICommentModel = {
  create: (comment: CreateCommentDTO) => Promise<Comment>;
  find: (filter: Partial<Comment & { _id: string }>) => Promise<Comment[]>;
  findByIdAndUpdate: (id: string, comment: Partial<Comment>, options: { new: true }) => Promise<Comment | null>;
};
