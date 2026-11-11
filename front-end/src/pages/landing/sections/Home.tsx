import { motion } from "framer-motion"
import HeroImage from "../../../assets/landing-page/hero-image/hero-img.png"
import { Button } from "../../../components/Button"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,  
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
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  },
}

// image variant
const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  },
}

const Home = () => {
  return (
    <div className="py-10 md:pt-20 md:pb-32 container-xl">
      <motion.div 
        className="grid items-center grid-cols-1 gap-12 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* left section */}
        <div className="w-full">
          <motion.p 
            variants={itemVariants}
            className="text-xs font-semibold tracking-widest uppercase text-primary/60"
          >
            Built for humidity, heat, and long days.
          </motion.p>

          <motion.h1 
            variants={itemVariants}
            className="mt-2 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            Make them look twice
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="max-w-md mt-3 text-base leading-relaxed font-base text-primary/75 md:text-lg"
          >
            Weightless, breathable coverage that locks in place without ever feeling heavy or greasy.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex gap-4 mt-6">
            <Button 
              to="/shop"
              variant="primary"
              className="md:px-8 md:py-3.5 px-4 py-2.5"
            >
              Shop Collections
            </Button>

            <Button
              to="/shade-guide"
              variant="outline"
              className="md:px-8 md:py-3.5 px-4 py-2.5"
            >
              Find Your Shade
            </Button>
          </motion.div>
        </div>

        {/* right section */}
        <motion.div 
          variants={imageVariants}
          className="w-full h-[400px] rounded-md overflow-hidden"
        >
          <motion.img 
            src={HeroImage} 
            alt="makeup picture" 
            draggable="false" 
            className="object-cover w-full h-full rounded-md select-none" 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home