import { api, apiPrivate } from "../api/api"

export const authService = {
  register: (credentials: object) => {
    return api.post("/auth/register-request.php", credentials);
  },
  verifyRegister: (credentials: object) => {
    return api.post("/auth/register-verify.php", credentials);
  },
  login: (credentials: object) => {
    return api.post("/auth/login-request.php", credentials);
  },
  verifyLogin: (credentials: object) => {
    return api.post("/auth/login-verify.php", credentials);
  },
  googleLogin: (code: string) => {
    return api.post("/auth/google-auth.php", { code });
  },
  logout: () => {
    return api.post("/auth/logout.php");
  },
  requestPasswordReset: (email: string) => {
    return api.post("/auth/request-reset-password.php", { email });
  },
  verifyPasswordReset: (data: {email: string, otp: string, new_password: string}) => {
    return api.post("/auth/verify-reset-password.php", data);
  },
  refreshToken: () => {
    return apiPrivate.post("/auth/refresh-token.php");
  }
}