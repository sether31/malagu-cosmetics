import { api } from "../api/api"

export const authService = {
  register: (credentials: object) => {
    return api.post("/auth/register-init.php", credentials);
  },
  verifyRegister: (credentials: object) => {
    return api.post("/auth/register-verify.php", credentials);
  },
  googleLogin: (code: string) => {
    return api.post("/auth/google-auth.php", { code }, {
      withCredentials: false 
    });
  }
}