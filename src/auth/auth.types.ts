type AccessTokenResponse = {
  access_token: string;
};

type ValidatePayload = {
  username: string;
  role: string;
  sub: any;
  iat: number;
  exp: number;
};

type ValidateResult = {
  username: string;
  role: string;
  userId: number;
};
