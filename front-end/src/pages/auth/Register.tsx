import React, { useEffect, useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import { motion } from "motion/react"
import { Button } from "../../components/Button"
import { authService } from "../../services/authService"
import { toast } from "react-toastify"
import axios from "axios"
import { Link,  useNavigate } from "react-router-dom"
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

  const navigate = useNavigate();
  const auth = authService;

  useEffect(() => {
    const validateErrors: FormErrorType = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email.length > 0 && !emailRegex.test(form.email)) {
      validateErrors.email = "Invalid email format.";
    } else if(isSubmitted && !form.email) {
      validateErrors.email = "Email is required."
    }

    if (form.password.length > 0 && form.password.length < 8) {
      validateErrors.password = "Password must be at least 8 characters.";
    } else if(isSubmitted && !form.password) {
      validateErrors.password = "Password is required."
    }

    if (form.confirmPassword.length > 0 && form.password !== form.confirmPassword) {
      validateErrors.confirmPassword = "Passwords do not match.";
    } else if(isSubmitted && !form.confirmPassword) {
      validateErrors.confirmPassword = "Confirm Password is required."
    }

    setErrors(validateErrors);
  }, [form.email, form.password, form.confirmPassword, isSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await auth.register(form);
      setForm({
        email: "",
        password: "",
        confirmPassword: ""
      })
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      if(axios.isAxiosError(error) && error.response) {
        const backendData = error.response.data;
        toast.error(backendData.message || 'Register Failed');
        setErrors((prevError) => ({
          ...prevError,
          email: backendData.message
        }))
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

  return (
    <>
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
                style="w-sm max-w-sm"
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
                style="w-sm max-w-sm"
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
                style="w-sm max-w-sm"
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
      
      {isLoading && (
        <PageLoader />
      )}
    </>
  )
}

export default Register
