import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { faqData } from "../../data/faq-data";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Shade Matching", "Orders & Shipping", "Products"];

  const filteredFaqs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-12 mx-auto space-y-10 text-gray-900 container-md"
    >
      <div className="space-y-3 text-center">
        <h1 className="font-serif text-4xl font-light tracking-wide text-primary">Frequently Asked Questions</h1>
        <p className="max-w-md mx-auto text-sm font-light text-gray-600">
          Got questions about finding your shade, orders, or our products? We've got answers.
        </p>
      </div>

      {/* category */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setActiveIndex(null);
            }}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* accordion */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          
          return (
            <div 
              key={faq.question}
              className="overflow-hidden transition-all bg-white border border-gray-300 rounded-lg"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="flex items-center justify-between w-full gap-4 px-6 py-4 text-left cursor-pointer focus:outline-none"
              >
                <span className="text-sm font-medium text-gray-900 md:text-base">{faq.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 shrink-0"
                >
                  <IoIosArrowDown className="text-lg" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pt-1 pb-5 text-xs font-light leading-relaxed border-t border-gray-100 md:text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FAQ;