export interface AuthCredentials {
    expiration: number;
    jwt: string;
    refresh: string;
    refreshExpiration: number;
  }
  export interface RequestOtp {
    password: string;
    username: string;
  }
  export interface ValidateOtp {
    otp: string;
    username: string;
  }
  export interface ForgotPassword {
    callbackUrl: string;
    email: string;
  }
  