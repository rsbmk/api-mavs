export type DecodeToken = {
  id: string;
};

export type TokenData = {
  id: string;
};

export type JWT = {
  verify: (token: string, secretOrPublicKey: string, options?: { complete: true }) => any; // is any becouse the jwt don't permit extended the token payload
  sign: (payload: string | Buffer | object, secretOrPrivateKey: string, options: { expiresIn: string | number }) => string;
};

export type IJWTService = {
  verify: (token: string) => DecodeToken;
  sign: (payload: TokenData) => string;
};
