export type User = {
  name: string;
  username: string;
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
  findById: (id: string) => Promise<User[]>;
  findOneByUsername: (username: string) => Promise<User[]>;
  update: (id: string, user: Partial<User>) => Promise<User>;
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
  find: (filter: Partial<User & { _id: string, toObject: () => User }>) => Promise<User[]>;
  findByIdAndUpdate: (id: string, user: Partial<User>, options: { new: true }) => Promise<User>;
};
