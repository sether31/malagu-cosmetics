import { motion } from "motion/react"
import { LuAlarmClock } from "react-icons/lu";
import HandImage from "../../../assets/landing-page/banner/hand.png";
import { Button } from "../../../components/Button";

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
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
}

const Banner = () => {
  return (
    <div className="bg-secondary text-white">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col items-center justify-between md:gap-6 md:flex-row container-xl"
      >
        <div className="flex-1 px-4 pt-20 text-center md:py-20 lg:px-20 xl:px-32 md:text-left">
          <motion.p  
            variants={itemVariants}
            className="flex items-center justify-center gap-1 text-sm md:justify-start text-pretty"
          >
            <LuAlarmClock />
            <span>Limited Time Offer</span>
          </motion.p>

          <motion.h1 
            variants={itemVariants}
            className="font-sans text-3xl font-bold leading-tight md:text-5xl"
          >
            Up to 30% OFF
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="mt-4 text-base leading-relaxed md:mt-0"
          >
            Find your new signature shade. From classic, show-stopping reds to everyday essentials, elevate your makeup routine with our highly pigmented, long-lasting formulas.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-6">
            <Button to="/shop" className="bg-pink hover:bg-pink/90">
              Shop Collections
            </Button>
          </motion.div>
        </div>
        
        <motion.div variants={imageVariants} className="max-w-60">
          <img 
            src={HandImage} 
            alt="Hand holding signature red lipstick" 
            draggable={false}
            className="object-cover w-full h-full select-none"   
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Banner
