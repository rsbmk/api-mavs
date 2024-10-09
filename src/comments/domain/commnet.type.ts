import { RecursivePartial } from "../../common/utils.type";

export type Comment = {
  characterId: number;
  comment: string;
  user: {
    id: string;
    username: string;
  }
  state: boolean;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date | null;
  id: string;
};

export type CreateCommentDTO = {
  characterId: number;
  comment: string;
  user: {
    id: string;
    username: string;
  }
}

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
  find: (filter: RecursivePartial<Comment>) => Promise<Comment[]>;
  findByIdAndUpdate: (id: string, comment: Partial<Comment>, options: { new: true }) => Promise<Comment | null>;
};
