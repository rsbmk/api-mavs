export type User = {
  name: string;
  username: string;
  characters: [];
  state: boolean;
  password: string;
  deleteAt: Date | null;
  createAt: Date;
  updateAt: Date;
  id: string;
};

export type CreateUserDTO = Pick<User, "name" | "username" | "password">;
export type UserWithoutPassword = Omit<User, "password">;

export type IUserRespository = {
  save: (user: CreateUserDTO) => Promise<User>;
  findById: (id: string) => Promise<User | null>;
  findOneByUsername: (username: string) => Promise<User | null>;
  update: (id: string, user: Partial<User>) => Promise<User | null>;
  delete: (id: string) => Promise<User>;
};

export type IUserService = {
  create: (user: CreateUserDTO) => Promise<UserWithoutPassword>;
  findOneById: (id: string) => Promise<UserWithoutPassword>;
  findOneByUsername: (username: string) => Promise<UserWithoutPassword>;
  update: (id: string, user: Partial<User>) => Promise<UserWithoutPassword>;
  delete: (id: string) => Promise<UserWithoutPassword>;
  findUserByUsernameWithPassword: (username: string) => Promise<User>;
  cleanPassword: (user: User) => UserWithoutPassword;
};

export type IUserModel = {
  create: (user: Partial<CreateUserDTO>) => Promise<User>;
  findOne: (filter: Partial<User & { _id: string }>) => Promise<User | null>;
  findByIdAndUpdate: (id: string, user: Partial<User>, options: { new: true }) => Promise<User | null>;
};
