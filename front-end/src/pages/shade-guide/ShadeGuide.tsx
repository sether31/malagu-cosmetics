import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button"; 
import ShadeGuideImage from "../../assets/landing-page/shade-guide/shade-guide.webp"; 
import UndertoneGuideImage from "../../assets/landing-page/shade-guide/undertone-guide.jpg"; 
import { shadeGuideData, undertoneGuideData, type GuideItem } from "../../data/color-guide";
import { IoMdClose } from "react-icons/io";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

const ShadeGuide = () => {
  const [activeModalItem, setActiveModalItem] = useState<GuideItem | null>(null);
  
  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl px-4 py-12 mx-auto space-y-12 text-gray-900"
      >
        <motion.div variants={itemVariants} className="overflow-hidden border border-gray-200 shadow-md rounded-xl">
          <img 
            src={ShadeGuideImage} 
            alt="Shade and skin tone spectrum" 
            className="object-cover object-center w-full h-48 md:h-64"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3 text-center">
          <h1 className="font-serif text-3xl font-bold tracking-wide sm:text-4xl text-primary">Find Your Perfect Shade</h1>
          <p className="max-w-lg mx-auto text-sm font-light leading-relaxed text-gray-600">
            Discovering your ideal match is simple. Follow our two-step guide to determine your skin depth and undertone.
          </p>
        </motion.div>

        {/* step 1 */}
        <motion.div variants={itemVariants} className="pb-10 space-y-4 border-b border-gray-200">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Step 01</span>
          <h2 className="font-serif text-2xl font-light tracking-wide">Determine Your Skin Depth</h2>
          <p className="text-sm font-light leading-relaxed text-gray-600">
            Skin depth refers to how light or deep your complexion is naturally. Look at your jawline in natural daylight:
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-5">
            {shadeGuideData.map((item) => (
              <div 
                key={item.title} 
                onClick={() => setActiveModalItem(item)}
                className={`p-5 border ${item.borderClass} ${item.bgClass} ${item.textClass || "text-gray-900"} rounded-lg text-center shadow-sm flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-103 duration-200`}
              >
                <span className="text-sm font-medium tracking-wide">{item.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* step 2 */}
        <motion.div variants={itemVariants} className="pb-10 space-y-4 border-b border-gray-200">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Step 02</span>
          <h2 className="font-serif text-2xl font-light tracking-wide">Identify Your Undertone</h2>
          <p className="text-sm font-light leading-relaxed text-gray-600">
            Undertone is the subtle hue underneath the surface of your skin. Check the veins on the inside of your wrist:
          </p>

          <div className="overflow-hidden border border-gray-300 rounded-xl">
            <img 
              src={UndertoneGuideImage} 
              alt="Undertone guide" 
              className="object-cover object-center w-full h-48 md:h-64"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-3">
            {undertoneGuideData.map((item) => (
              <div 
                key={item.title} 
                className={`p-6 border ${item.borderClass} rounded-lg space-y-2 ${item.bgClass} shadow-sm`}>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-medium ${item.textClass}`}>{item.title}</h3>
                </div>
                <p className={`text-xs font-light leading-relaxed ${item.textClass}/80`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* cta */}
        <motion.div variants={itemVariants} className="py-8 space-y-4 text-center">
          <h3 className="font-serif text-2xl font-light">Ready to shop your match?</h3>
          <div>
            <Link to="/shop">
              <Button className="px-8 py-3 text-xs tracking-widest uppercase rounded-md cursor-pointer">
                Explore Collection
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {activeModalItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalItem(null)}
              className="fixed inset-0 z-50 bg-black"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative w-full max-w-md p-6 space-y-6 bg-white border border-gray-100 shadow-2xl pointer-events-auto rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="absolute text-gray-400 cursor-pointer top-4 right-4 hover:text-gray-700"
                >
                  <IoMdClose className="text-2xl" />
                </button>

                <div className="pr-6 space-y-2">
                  <span className="10px] font-semibold tracking-widest uppercase text-gray-700">Shade</span>
                  <h3 className="font-serif text-2xl font-light text-primary">{activeModalItem.title}</h3>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <img 
                    src={activeModalItem.img} 
                    alt={activeModalItem.title}
                    className="object-cover object-center w-full h-40 filter brightness-95"
                  />
                </div>

                <p className="text-sm font-light leading-relaxed ">
                  {activeModalItem.description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShadeGuide;