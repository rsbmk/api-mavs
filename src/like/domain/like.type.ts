export type Like = {
  id: string;
  userId: string;
  characterId: number;
  state: boolean;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date | null;
};

export type CreateLikeDTO = Pick<Like, "userId" | "characterId">;
export type FindFilter = Partial<Pick<Like, "userId" | "characterId">>;

export type ILikeRepository = {
  create: (like: CreateLikeDTO) => Promise<Like>;
  find: (filter: FindFilter) => Promise<Like[]>;
  update: (id: string, like: Partial<Like>) => Promise<Like | null>;
};

export type ILikeService = {
  create: (like: CreateLikeDTO) => Promise<Like>;
  findByCharacterAndUserId: (filter: FindFilter) => Promise<Like>;
  findAllByUserId: (userId: string) => Promise<Like[]>;
  delete: (id: string) => Promise<Like | null>;
};

export type ILikeModel = {
  create: (like: CreateLikeDTO) => Promise<Like>;
  find: (filter: Partial<Like>) => Promise<Like[]>;
  findByIdAndUpdate: (id: string, like: Partial<Like>, options: { new: true }) => Promise<Like | null>;
};
