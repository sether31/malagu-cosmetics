import React, { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import Input from "../../components/Input";
import PageLoader from "../../components/PageLoader";
import OTPInput from "react-otp-input";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import axios from "axios";
import LoginImage from "../../assets/auth/login.jpg";
import { FaRegEye, FaRegEyeSlash, FaCheck, FaXmark } from "react-icons/fa6";

interface PasswordsType {
  password: string;
  confirmPassword: string;
}

interface PasswordErrorType {
  password?: string;
  confirmPassword?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: "-80%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const [otp, setOtp] = useState<string>("");
  const [passwords, setPasswords] = useState<PasswordsType>({
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrorType>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      return;
    }

    setEmailError("");
    setIsLoading(true);

    try {
      const res = await authService.requestPasswordReset(email);
      toast.success(res.data.message || "OTP sent to your email!");
      setStep("verify");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to send reset code.");
        if (error.response.data.errors?.email) {
          setEmailError(error.response.data.errors.email);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswords = (data: PasswordsType) => {
    const errs: PasswordErrorType = {};
    if (!data.password) {
      errs.password = "Password is required.";
    } else if (data.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }

    if (!data.confirmPassword) {
      errs.confirmPassword = "Confirm Password is required.";
    } else if (data.password !== data.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    return errs;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...passwords, [name]: value };
    setPasswords(updated);
    setPasswordErrors(validatePasswords(updated));
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP code.");
      return;
    }

    const errs = validatePasswords(passwords);
    setPasswordErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the password errors before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyPasswordReset({
        email,
        otp,
        new_password: passwords.password,
      });

      toast.success(res.data.message || "Password reset successful! Please log in.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Invalid or expired OTP code.");
      } else {
        toast.error("Failed to reset password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid w-full min-h-screen grid-cols-1 overflow-hidden md:grid-cols-2"
      >
        <motion.div variants={imageVariants} className="relative hidden overflow-hidden md:flex">
          <img src={LoginImage} alt="Makeup Image" className="absolute inset-0 object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 flex flex-col justify-end p-12 text-white">
            <h2 className="font-serif text-3xl font-light tracking-wide">Reset your password.</h2>
            <p className="max-w-sm mt-2 text-sm font-light leading-relaxed text-gray-200">
              Recover your account securely. Enter your registered email to receive an OTP code.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col justify-center max-w-sm gap-4 px-4 mx-auto w-full">
          <motion.div variants={itemVariants}>
            <Link to="/" className="flex flex-col justify-center font-serif tracking-tight text-center">
              <span className="text-xl font-black tracking-widest text-primary">MALAGU</span>
              <span className="text-[10px] tracking-widest text-gray-700">COSMETICS</span>
            </Link>
          </motion.div>

          {/* request */}
          {step === "request" ? (
            <>
              <motion.div variants={itemVariants} className="space-y-1">
                <h1 className="font-serif text-3xl font-normal tracking-wide text-gray-900">Forgot Password</h1>
                <p className="text-xs font-light text-gray-500">
                  Enter your email address to receive a 6-digit reset code.
                </p>
              </motion.div>

              <form onSubmit={handleRequestReset} className="flex flex-col mt-2 space-y-4">
                <motion.div variants={itemVariants}>
                  <Input
                    label={<span>Email Address <span className="text-red-500">*</span></span>}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    error={emailError}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button type="submit" className="w-full rounded-md">
                    Send Reset Code
                  </Button>
                </motion.div>
              </form>
            </>
          ) : (
            // verify
            <form onSubmit={handleVerifyAndReset} className="flex flex-col space-y-4">
              <div className="space-y-1 text-center">
                <h2 className="font-serif text-3xl font-normal tracking-wide text-gray-900">Verify & Reset</h2>
                <p className="text-xs font-light text-gray-500">
                  Enter the code sent to <span className="font-medium text-gray-900">{email}</span> and your new password.
                </p>
              </div>

              <div className="flex justify-center my-2">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span className="w-2"></span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="!w-11 !h-11 text-lg font-semibold text-center border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  )}
                />
              </div>

              <Input
                label={<span>New Password <span className="text-red-500">*</span></span>}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Must be at least 8 characters"
                value={passwords.password}
                onChange={handlePasswordChange}
                error={passwordErrors.password}
                rightIcon={
                  <div className="flex items-center gap-1">
                    {passwords.password.length > 0 && (
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
                label={<span>Confirm Password <span className="text-red-500">*</span></span>}
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.confirmPassword}
                rightIcon={
                  <div className="flex items-center gap-1">
                    {passwords.confirmPassword.length > 0 && (
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

              <Button type="submit" className="w-full rounded-md mt-2">
                Reset Password
              </Button>

              <button
                type="button"
                onClick={() => setStep("request")}
                className="text-xs text-gray-500 transition-colors hover:text-black text-center cursor-pointer"
              >
                Wrong email? Go back
              </button>
            </form>
          )}

          <motion.p variants={itemVariants} className="flex justify-center gap-1 mt-2 text-xs text-gray-600">
            <span>Remembered your password?</span>
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </motion.p>
        </div>
      </motion.section>

      {isLoading && <PageLoader />}
    </>
  );
};

export default ForgotPassword;