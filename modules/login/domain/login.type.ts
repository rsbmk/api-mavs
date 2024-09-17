export type Credentials = {
  username: string;
  password: string;
};

export type UserLogin = {
  username: string;
  token: string;
  id: string;
};

export type IAuthService = {
  login: (credentials: Credentials) => Promise<UserLogin>;
};
