export interface IUserLogin {
  email: string;
  password: string;
  fcmToken: string;
}

export interface IResetPassPayload {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IOtpToken {
  email: string;
  otp: string;
  role: string;
}
export interface IUserChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
