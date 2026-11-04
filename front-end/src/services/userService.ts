import { apiPrivate } from "../api/api";

export const userService = {
  getUserProfile: () => {
    return apiPrivate.post("/account/get-user.php");
  },
  updateUserProfile: (formData: FormData) => {
    return apiPrivate.post("/account/update-user-profile.php", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  requestEmailUpdate: (data: { new_email: string }) => {
    return apiPrivate.post("/account/request-email-update.php", data);
  },
  verifyEmailUpdate: (data: { new_email: string, otp: string }) => {
    return apiPrivate.post("/account/verify-email-update.php", data);
  },
  changePassword: (data: { current_password: string, new_password: string }) => {
    return apiPrivate.post("/account/update-password.php", data);
  }
}