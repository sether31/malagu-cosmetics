import { useEffect, useState } from "react";
import NoProfile from "../../assets/no-profile.png";
import { Button } from "../../components/Button";
import Input from "../../components/Input";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/getImageUrl";
import { userService } from "../../services/userService";
import OTPInput from "react-otp-input";
import { FaCheck, FaRegEye, FaRegEyeSlash, FaXmark } from "react-icons/fa6";

const Account = () => {
  const { user, checkAuth } = useAuthStore();

  const [profileForm, setProfileForm] = useState({
    name: "",
    profilePicture: null as File | string | null,
  });
  const [profileErrors, setProfileErrors] = useState<{ name?: string }>({});
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProfileSubmitting, setIsProfileSubmitting] = useState<boolean>(false);

  const [newEmail, setNewEmail] = useState<string>("");
  const [emailStep, setEmailStep] = useState<"form" | "otp">("form");
  const [emailOtp, setEmailOtp] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState<boolean>(false);

  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState<boolean>(false);

  // Check if user has an existing password (defaults to true if property is missing)
  const hasExistingPassword = (user as any)?.has_password ?? true;

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        profilePicture: user.profile_picture || null,
      });
      setNewEmail(user.email || "");
      setPreviewUrl(user.profile_picture || "");
    }
  }, [user]);

  // profile
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files && files[0]) {
      const selectedFile = files[0];
      setProfileForm((prev) => ({ ...prev, profilePicture: selectedFile }));
      setPreviewUrl(URL.createObjectURL(selectedFile));
      return;
    }

    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const hasProfileChanges =
    profileForm.name !== (user?.name || "") ||
    profileForm.profilePicture instanceof File;

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasProfileChanges) return;

    if (!profileForm.name.trim()) {
      setProfileErrors({ name: "Name is required." });
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setProfileErrors({});
    setIsProfileSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);

      if (profileForm.profilePicture instanceof File) {
        formData.append("profile_picture", profileForm.profilePicture);
      }

      const res = await userService.updateUserProfile(formData); 

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        await checkAuth();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
  };

  const hasEmailChanges = newEmail !== (user?.email || "");

  const handleEmailRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasEmailChanges) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail.trim()) {
      setEmailError("Email is required.");
      return;
    } else if (!emailRegex.test(newEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setIsEmailSubmitting(true);

    try {
      const res = await userService.requestEmailUpdate({ new_email: newEmail });
      toast.success(res.data.message || "OTP sent to your email.");
      setEmailStep("otp");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsEmailSubmitting(false);
    }
  }

  const handleVerifyEmailOtp = async () => {
    if(emailOtp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    setIsEmailSubmitting(true);

    try {
      const res = await userService.verifyEmailUpdate({ new_email: newEmail, otp: emailOtp});

      if(res.data.success) {
        toast.success(res.data.message || "Email updated successfully!");
        await checkAuth();
        setEmailStep("form");
        setEmailOtp("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setIsEmailSubmitting(false);
    }
  }

  // password validation
  const validatePasswordForm = (data: typeof passwordForm) => {
    const validateErrors: { [key: string]: string } = {};

    if (hasExistingPassword && !data.currentPassword) {
      validateErrors.currentPassword = "Current Password is required.";
    }

    if (!data.password) {
      validateErrors.password = "Password is required.";
    } else if (data.password.length < 8) {
      validateErrors.password = "Password must be at least 8 characters.";
    }

    if (!data.confirmPassword) {
      validateErrors.confirmPassword = "Confirm Password is required.";
    } else if (data.password !== data.confirmPassword) {
      validateErrors.confirmPassword = "Passwords do not match.";
    }

    return validateErrors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...passwordForm, [name]: value };
    setPasswordForm(updatedForm);
    setPasswordErrors(validatePasswordForm(updatedForm));
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validate = validatePasswordForm(passwordForm);
    setPasswordErrors(validate);

    if (Object.keys(validate).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsPasswordSubmitting(true);

    try {
      const payload: any = {
        new_password: passwordForm.password,
      };

      if (hasExistingPassword) {
        payload.current_password = passwordForm.currentPassword;
      }

      const res = await userService.changePassword(payload);

      if (res.data.success) {
        toast.success(res.data.message || "Password saved successfully!");
        setPasswordForm({ currentPassword: "", password: "", confirmPassword: "" });
        setPasswordErrors({});
        setIsPasswordOpen(false);
        await checkAuth(); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col container-md gap-8 px-4 py-10 mx-auto">
      <h1 className="text-2xl font-bold text-primary">Account Settings</h1>

      {/* user profile */}
      <div className="p-6 border border-gray-300 rounded-md shadow-sm bg-bgColor">
        <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
        
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="block w-40 h-40 mx-auto overflow-hidden border-3 border-emerald-600 rounded-full">
              <img 
                className="object-cover w-full h-full" 
                src={previewUrl ? (previewUrl.startsWith("blob:") ? previewUrl : getImageUrl(previewUrl)) : NoProfile} 
                alt="profile picture" 
              />
            </div>
            <Input
              type="file"
              id="profilePicture"
              name="profilePicture"
              label="Profile Picture"
              accept="image/*"
              onChange={handleProfileChange}
              inputClassName="cursor-pointer"
            />
          </div>

          <Input
            id="name"
            name="name"
            label="Name"
            type="text"
            value={profileForm.name}
            error={profileErrors.name}
            onChange={handleProfileChange}
          />

          <Button
            type="submit"
            className={`py-2 transition-opacity ${!hasProfileChanges || isProfileSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!hasProfileChanges || isProfileSubmitting}
          >
            {isProfileSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>

      {/* email */}
      <div className="p-6 border border-gray-300 rounded-md shadow-sm bg-bgColor">
        <h2 className="mb-4 text-lg font-semibold">Email Address</h2>
        
        {emailStep === "form" ? (
          <form onSubmit={handleEmailRequest} className="space-y-4">
            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={newEmail}
              error={emailError}
              onChange={handleEmailChange}
            />

            <Button
              type="submit"
              className={`py-2 transition-opacity ${!hasEmailChanges || isEmailSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!hasEmailChanges || isEmailSubmitting}
            >
              {isEmailSubmitting ? "Updating..." : "Update Email"}
            </Button>
          </form>
        ): (
          <div className="flex flex-col items-center py-4 space-y-4 text-center">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900">Verify Your New Email</h3>
              <p className="text-sm text-gray-500">
                Enter the 6-digit verification code sent to <span className="font-medium text-gray-900">{newEmail}</span>
              </p>
            </div>

            <OTPInput
              value={emailOtp}
              onChange={setEmailOtp}
              numInputs={6}
              renderSeparator={<span className="w-2"></span>}
              renderInput={(props) => (
                <input 
                  {...props} 
                  className="!w-12 !h-12 text-xl font-semibold text-center border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              )}
            />

            <div className="flex flex-col w-full gap-2 pt-2">
              <Button onClick={handleVerifyEmailOtp} className="py-2 rounded-md w-max mx-auto" disabled={isEmailSubmitting}>
                {isEmailSubmitting ? "Verifying..." : "Verify & Save Email"}
              </Button>
              
              <button 
                type="button"
                onClick={() => {
                  setEmailStep("form");
                  setEmailOtp("");
                }}
                className="text-sm text-gray-500 transition-colors cursor-pointer hover:text-black w-max mx-auto"
              >
                Cancel / Change Email
              </button>
            </div>
          </div>
        )}
      </div>

      {/* password */}
      <div className="p-6 border border-gray-300 rounded-md shadow-sm bg-bgColor">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Password</h2>
          <p className="text-sm text-gray-600">
            {hasExistingPassword ? "Update your password to keep your account secure." : "Set a password for your account."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsPasswordOpen(!isPasswordOpen);
            setPasswordForm({ currentPassword: "", password: "", confirmPassword: "" });
            setPasswordErrors({});
          }}
          className="px-4 py-2 text-sm text-white rounded-md cursor-pointer bg-primary hover:opacity-90 transition-all"
        >
          {isPasswordOpen ? "Cancel" : (hasExistingPassword ? "Change Password" : "Set Password")}
        </button>
      </div>

      {isPasswordOpen && (
        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4 pt-4 border-t border-gray-200">
          {hasExistingPassword && (
            <Input
              id="currentPassword"
              name="currentPassword"
              label={<span>Current Password <span className="text-red-500">*</span></span>}
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter your current password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
              rightIcon={
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="cursor-pointer"
                  >
                    {showCurrentPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              }
            />
          )}

          <Input
            id="password"
            name="password"
            label={<span>{hasExistingPassword ? "New Password" : "Password"} <span className="text-red-500">*</span></span>}
            type={showPassword ? "text" : "password"}
            placeholder="Must be at least 8 characters long"
            value={passwordForm.password}
            onChange={handlePasswordChange}
            error={passwordErrors.password}
            rightIcon={
              <div className="flex items-center gap-1">
                {passwordForm.password.length > 0 && (
                  passwordErrors.password ? (
                    <span className="text-red-500"><FaXmark /></span>
                  ) : (
                    <span className="text-green-500"><FaCheck /></span>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            }
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            label={<span>Confirm Password <span className="text-red-500">*</span></span>}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.confirmPassword}
            rightIcon={
              <div className="flex items-center gap-1">
                {passwordForm.confirmPassword.length > 0 && (
                  passwordErrors.confirmPassword ? (
                    <span className="text-red-500"><FaXmark /></span>
                  ) : (
                    <span className="text-green-500"><FaCheck /></span>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer"
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            }
          />

          <Button
            type="submit"
            className="py-2"
            disabled={isPasswordSubmitting}
          >
            {isPasswordSubmitting ? "Saving Password..." : (hasExistingPassword ? "Update Password" : "Set Password")}
          </Button>
        </form>
      )}
    </div>
    </div>
  );
};

export default Account;