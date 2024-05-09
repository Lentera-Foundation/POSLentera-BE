export type TSignupRequest = {
  fullname: string;
  email: string;
  username: string;
  password: string;
};

export type TSignupResponse = {
  message?: string;
  id?: number;
  fullname?: string;
  email?: string;
  username?: string;
  error?: string;
};
