type AccessTokenResponse = {
  access_token: string;
};

type ValidatePayload = {
  username: string;
  sub: any;
  iat: number;
  exp: number;
};

type ValidateResult = {
  username: string;
  userId: number;
};
