import React from "react"
import { motion } from "motion/react";
import MakeupVideo from "../../../assets/landing-page/video.mp4"

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

// text/btn variant
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

// video variant
const videoVariants = {
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

const FruitySection = () => {
  return (
    <div className="pt-20 pb-32 container-xl">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid items-center grid-cols-1 gap-12 md:grid-cols-2"
      >
        {/* left section */}
        <motion.div 
          variants={videoVariants}
          className="w-full max-w-sm mx-auto h-[500px] rounded-xl overflow-hidden shadow-md"
        >
          <video 
            src={MakeupVideo}
            autoPlay 
            loop 
            muted 
            playsInline
            className="object-cover w-full h-full"
          />
        </motion.div>

        {/* right section */}
        <div className="flex flex-col items-start w-full">
          <motion.span 
            variants={itemVariants}
            className="text-xs font-semibold tracking-widest uppercase text-primary/60"
          >
            Infused with Real Fruit Extracts
          </motion.span>
          <motion.h2 
            variants={itemVariants}
            className="mt-2 font-serif text-3xl font-medium leading-tight md:text-4xl"
          >
            Juicy hydration, Resist the heat.
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mt-4 text-base leading-relaxed text-primary/75"
          >
            Packed with vitamin-rich fruit extracts and ultra-lightweight hydration. Experience a refreshing, non-sticky pop of color that tastes as fresh as it looks from morning until night.
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}

export default FruitySection;
