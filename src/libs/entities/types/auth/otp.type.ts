export type TSendOtpResponse = {
  message?: string;
  error?: string;
};

export type TSendOtpRequest = {
  email: string;
};

export type TVerifyOtpRequest = {
  email: string;
  otp: string;
};

export type TVerifyOtpResponse = {
  message?: string;
  error?: string;
};
