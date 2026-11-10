import React, { useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import { motion } from "motion/react"
import { Button } from "../../components/Button"
import { authService } from "../../services/authService"
import { toast } from "react-toastify"
import axios from "axios"
import { Link,  useNavigate } from "react-router-dom"
import Input from "../../components/Input"
import { FcGoogle } from "react-icons/fc";
import LoginImage from "../../assets/auth/login.jpg"
import PageLoader from "../../components/PageLoader"
import OTPInput from "react-otp-input"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { useCart } from "../../store/useCart"

interface FormType {
  email: string
  password: string
}

interface FormErrorType {
  email?: string
  password?: string
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

const Login = () => {
  const [form, setForm] = useState<FormType>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrorType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [step, setStep] = useState<"login" | "otp">("login");
  const [otp, setOtp] = useState<string>("");

  const navigate = useNavigate();
  const auth = authService;

  const { mergeCart } = useCart();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const validateForm = () => {
    const validateErrors: FormErrorType = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email.length > 0 && !emailRegex.test(form.email)) {
      validateErrors.email = "Invalid email format.";
    } else if(!form.email) {
      validateErrors.email = "Email is required."
    }

    if(!form.password) {
      validateErrors.password = "Password is required."
    }

    return validateErrors;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validate = validateForm();
    setErrors(validate);

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (Object.keys(validate).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await auth.login(form);

      toast.success(res.data.message || "OTP sent to your email!");
      setStep("otp");
    } catch (error) {
      if(axios.isAxiosError(error) && error.response) {
        const backendData = error.response.data;
        toast.error(backendData.message || 'Login Failed');
        if (backendData.errors) {
          setErrors((prev) => ({
            ...prev,
            ...backendData.errors
          }));
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setIsLoading(true);

      try {
        const res = await authService.googleLogin(codeResponse.code);
        toast.success(res.data.message);
        await mergeCart();
        navigate("/");
      } catch (error) {
        console.log('Failed to login google: ', error);
        if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to login google');
      } else {
        toast.error('Failed to login google');
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
    if(otp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await auth.verifyLogin({
        email: form.email,
        password: form.password,
        otp: otp
      });
      toast.success(res.data.message || "Login Successfully!");

      await mergeCart();

      setForm({
        email: "",
        password: ""
      });
      setOtp("");
      navigate("/")
    } catch (error) {
      if(axios.isAxiosError(error) && error.response) {
        const backendData = error.response.data;
        toast.error(backendData.message || "Invalid or expired OTP code.")
      } else {
        toast.error("An error occurred during verification.");
      }
    } finally {
      setIsLoading(false);
    }
  } 
  return (
    <>
      {step === "login" ? (
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
              <h2 className="font-serif text-3xl font-light tracking-wide">Confidence in every shade.</h2>
              <p className="max-w-sm mt-2 text-sm font-light leading-relaxed text-gray-200">
                Welcome back. Explore your favorite shades and discover beauty essentials made for every version of you.
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
              <h1 className="font-serif text-3xl font-normal tracking-wide text-gray-900">Welcome back</h1>
              <p className="text-xs font-light text-gray-500">Please enter your details to sign in.</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col mt-2"> 
              <motion.div variants={itemVariants}>
                <Input
                  inputClassName="w-sm max-w-sm mb-4"
                  label={<span>Email</span>}
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  type="text"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Input
                  inputClassName="w-sm max-w-sm mb-2"
                  label={<span>Password</span>}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer"
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  }
                />
              </motion.div>

              <motion.div variants={itemVariants} className="w-max ml-auto block mb-4">
                <Link to="/forgot-password" className="text-xs font-medium text-right hover:opacity-80 ease-in-out duration-300">
                  Forgot Password?
                </Link>
              </motion.div>
        
              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full rounded-md">
                  Login
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="flex items-center gap-4 my-4 text-sm">
              <span className="flex-1 h-0.5 bg-gray-200"></span>
              <span>Or Sign In With</span>
              <span className="flex-1 h-0.5 bg-gray-200"></span>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <button 
                onClick={() => handleGoogleLogin()}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm duration-300 ease-in-out bg-white border border-gray-300 rounded-md cursor-pointer active:scale-95 hover:bg-black/5 cursor-pointe"
              >
                <FcGoogle />
                <span>Continue with Google</span>
              </button>
            </motion.div>

            
            <motion.p variants={itemVariants} className="flex justify-center gap-1 my-2 text-sm">
              <span>Don't have an account?</span> 
              <Link to="/register" className="text-blue-500 duration-300 ease-in-out active:scale-95">Create an account</Link>
            </motion.p>
          </div>
        </motion.section>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center max-w-sm min-h-screen gap-6 px-4 mx-auto text-center"
        >
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-normal tracking-wide text-gray-900">Verify Email</h2>
            <p className="text-sm font-light text-gray-500">
              We sent a 6-digit code to <span className="font-medium text-gray-900">{form.email}</span>
            </p>
          </div>

          <OTPInput
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

          <Button onClick={handleVerifyOtp} className="w-full mt-4 rounded-md">
            Submit
          </Button>
          
          <button 
            onClick={() => setStep("login")}
            className="text-sm text-gray-500 transition-colors cursor-pointer hover:text-black"
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

export default Login
