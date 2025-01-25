export type IBcrypt = {
  compare: (password: string, hash: string) => Promise<boolean>;
  hash: (password: string, salt: string) => Promise<string>;
  genSalt: (rounds: number) => void | Promise<any>; // this is the type from bcrypt lib
};

export type IBcryptService = {
  compare: (password: string, hash: string) => Promise<boolean>;
  hash: (password: string, salt: string) => Promise<string>;
  genSalt: (rounds: number) => Promise<string>;
};
