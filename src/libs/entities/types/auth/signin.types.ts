export type TSigninRequest = {
  email: string;
  password: string;
};

export type TSigninResponse = {
  message?: string;
  access_token?: string;
  error?: string;
};
