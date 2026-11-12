import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { Button } from "../../../components/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

const NewsLetter = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setError("");
    toast.success("Successfully subscribed!");
    setEmail("");
  };

  return (
    <div 
      className="py-16 bg-center bg-cover md:py-32 dither-bg"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col items-center justify-center gap-4 px-4 container-xl"
      >
        <motion.h2 variants={itemVariants} className="font-serif text-3xl font-semibold text-center md:text-4xl">
          Unlock 15% Off Your First Order 
        </motion.h2>

        <motion.p variants={itemVariants} className="max-w-md text-base text-center text-pretty">
          Join the MALAGU club. Be the first to know about new launches, exclusive offers, and beauty tips.
        </motion.p>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md gap-2 mt-4">
          <div className="flex flex-wrap w-full gap-2">
            <input
              type="email" 
              placeholder="Enter your email address"
              className={`flex-1 px-4 py-2 border bg-bgColor text-black outline-none transition-colors ${
                error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
              }`}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(""); 
              }}
              value={email}
            />

            <Button type="submit" className="flex-1">
              Subscribe
            </Button>
          </div>

          {error && (
            <span className="self-start text-xs font-medium text-red-600 transition-all">
              * {error}
            </span>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
};

export default NewsLetter;