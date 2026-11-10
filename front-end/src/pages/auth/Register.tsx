import React, { useEffect, useState } from "react"
import OtpInput from 'react-otp-input';
import { useGoogleLogin } from "@react-oauth/google"
import { motion } from "motion/react"
import { Button } from "../../components/Button"
import { authService } from "../../services/authService"
import { toast } from "react-toastify"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Input from "../../components/Input"
import { FaCheck, FaRegEye, FaRegEyeSlash, FaXmark } from "react-icons/fa6"
import { FcGoogle } from "react-icons/fc";
import RegisterImage from "../../assets/auth/register.jpg"
import PageLoader from "../../components/PageLoader"

interface FormType {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrorType {
  email?: string
  password?: string
  confirmPassword?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
}

const imageVariants = {
  hidden: { opacity: 0, x: "-80%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
}

const Register = () => {
  const [form, setForm] = useState<FormType>({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrorType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // otp
  const [step, setStep] = useState<"register" | "otp">("register");
  const [otp, setOtp] = useState<string>("");
  

  const navigate = useNavigate();
  const auth = authService;

  const validateForm = (data: FormType) => {
    const validateErrors: FormErrorType = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // check Email
    if (!data.email) {
      validateErrors.email = "Email is required.";
    } else if (!emailRegex.test(data.email)) {
      validateErrors.email = "Invalid email format.";
    }

    // check Password
    if (!data.password) {
      validateErrors.password = "Password is required.";
    } else if (data.password.length < 8) {
      validateErrors.password = "Password must be at least 8 characters.";
    }

    // check Confirm Password
    if (!data.confirmPassword) {
      validateErrors.confirmPassword = "Confirm Password is required.";
    } else if (data.password !== data.confirmPassword) {
      validateErrors.confirmPassword = "Passwords do not match.";
    }

    return validateErrors;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value
    };

    setForm(updatedForm);

    setErrors(validateForm(updatedForm));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validate = validateForm(form);
    
    setErrors(validate);

    if (Object.keys(validate).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await auth.register(form);
      toast.success(res.data.message || "OTP sent to your email!");
      setStep("otp");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const backendData = error.response.data;
        toast.error(backendData.message || 'Register Failed');
        if (backendData.errors) {
          setErrors((prev) => ({
            ...prev,
            ...backendData.errors
          }));
        }
      }
    } finally {
      setIsLoading(false);
      setIsSubmitted(false);
    }
  }

  const handleGoogleRegister = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setIsLoading(true);

      try {
        const res = await authService.googleLogin(codeResponse.code);
        toast.success(res.data.message)
        navigate("/");
      } catch (error) {
        console.log('Failed to register google: ', error);
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || 'Failed to register google');
        } else {
          toast.error('Failed to register google');
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);

    try {

      const res = await auth.verifyRegister({
        email: form.email,
        password: form.password,
        otp: otp
      });

      toast.success(res.data.message || "Registered successfully!");
      
      setForm({ email: "", password: "", confirmPassword: "" });
      setOtp("");
      navigate("/login");

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Verification Failed');
      } else {
        toast.error("An error occurred during verification.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {step === "register" ? (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid w-full min-h-screen grid-cols-1 md:grid-cols-2"
        >
          <motion.div variants={imageVariants} className="relative hidden overflow-hidden md:flex">
            <img src={RegisterImage} alt="Makeup Image" className="absolute inset-0 object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="relative z-10 flex flex-col justify-end p-12 text-white">
              <h2 className="font-serif text-3xl font-light tracking-wide">Make every look your own.</h2>
              <p className="max-w-sm mt-2 text-sm font-light leading-relaxed text-gray-200">
                Create your account and discover makeup designed to inspire, express, and elevate your everyday beauty.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col justify-center max-w-sm gap-2 px-4 mx-auto">
            <motion.div variants={itemVariants}>
              <Link to="/" className="flex flex-col justify-center font-serif tracking-tight text-center">
                <span className="text-xl font-black tracking-widest text-primary">MALAGU</span>
                <span className="text-[10px] tracking-widest text-gray-700">COSMETICS</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <h1 className="font-serif text-3xl font-normal tracking-wide text-gray-900">Create Account.</h1>
              <p className="text-xs font-light text-gray-500">Join us to save your favorite products.</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col mt-2 space-y-4">
              <motion.div variants={itemVariants}>
                <Input
                  inputClassName="w-sm max-w-sm"
                  label={<span>Email <span className="text-red-500">*</span></span>}
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  rightIcon={
                    form.email.length > 0 ? (
                      errors.email ? <span className="text-red-500"><FaXmark /></span> : <span className="text-green-500"><FaCheck /></span>
                    ) : null
                  }
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  inputClassName="w-sm max-w-sm"
                  label={<span>Password <span className="text-red-500">*</span></span>}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Must be at least 8 characters long"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  rightIcon={
                    <div className="flex gap-1">
                      {form.password.length > 0 ? (
                        errors.password ? <span className="text-red-500"><FaXmark /></span> : <span className="text-green-500"><FaCheck /></span>
                      ) : null}

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
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  inputClassName="w-sm max-w-sm"
                  label={<span>Confirm Password <span className="text-red-500">*</span></span>}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  rightIcon={
                    <div className="flex gap-1">
                      {form.confirmPassword.length > 0 ? (
                        errors.confirmPassword ? <span className="text-red-500"><FaXmark /></span> : <span className="text-green-500"><FaCheck /></span>
                      ) : null}

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="cursor-pointer"
                        >
                          {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                      </div>
                    </div>
                  }
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full rounded-md">
                  Create Account
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="flex items-center gap-4 my-4 text-sm">
              <span className="flex-1 h-0.5 bg-gray-200"></span>
              <span>Or SignUp With</span>
              <span className="flex-1 h-0.5 bg-gray-200"></span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                onClick={() => handleGoogleRegister()}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm duration-300 ease-in-out bg-white border border-gray-300 rounded-md cursor-pointer active:scale-95 hover:bg-black/5 cursor-pointe"
              >
                <FcGoogle />
                <span>Sign up with Google</span>
              </button>
            </motion.div>

            <motion.p variants={itemVariants} className="flex justify-center gap-1 my-2 text-sm">
              <span>Already have an account?</span>
              <Link to="/login" className="text-blue-500 duration-300 ease-in-out active:scale-95">Log in</Link>
            </motion.p>
          </div>
        </motion.section>
      ) : ( 
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-screen max-w-sm px-4 mx-auto gap-6 text-center"
        >
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-normal tracking-wide text-gray-900">Verify Email</h2>
            <p className="text-sm font-light text-gray-500">
              We sent a 6-digit code to <span className="font-medium text-gray-900">{form.email}</span>
            </p>
          </div>

          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span className="w-2"></span>}
            renderInput={(props) => (
              <input 
                {...props} 
                className="!w-12 !h-12 text-xl font-semibold text-center border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            )}
          />

          <Button onClick={handleVerifyOtp} className="w-full rounded-md mt-4">
            Submit
          </Button>
          
          <button 
            onClick={() => setStep("register")}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            Wrong email? Go back
          </button>
        </motion.div>
      )}
      {isLoading && (
        <PageLoader />
      )}
    </>
  )
}

export default Register
