import { api } from "../api/api"

export const authService = {
  register: (credentials: object) => {
    return api.post("/auth/register.php", credentials);
  },
  googleLogin: (code: string) => {
    return api.post("/auth/google-login.php", { code }, {
      withCredentials: false 
    });
  }
}