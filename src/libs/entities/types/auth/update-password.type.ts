export type TUpdatePasswordRequest = {
  email: string;
  password: string;
};

export type TUpdatePasswordResponse = {
  message?: string;
  error?: string;
};
