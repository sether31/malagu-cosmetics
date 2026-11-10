import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { api } from "../../../api/api"
import ProductCard, { type ProductProps } from "../../../components/ProductCard"
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import ProductSkeleton from "../../../components/ProductSkeleton"


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,  
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y:0,
    transition: {
      type: "spring" as const, stiffness: 300, damping: 24
    }
  }
}

const JuicyCollection = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/products/get-products.php', {
          params: {
            category: 'Lips',
            sub_category: 'Lip Oil', 
            limit: 4
          }
        });
        
        setProducts(res.data.data)
      } catch (error) {
        console.log(`Error:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    getProducts();
  }, [])

  
  return (
    <div className="py-10 md:pt-20 md:pb-32 container-xl">
      <h1 className="font-serif text-3xl font-medium leading-tight text-center md:text-4xl">
        The Juicy Collections
      </h1>

      {isLoading ? (
        <div className="mt-10">
          <ProductSkeleton length={4} />
        </div>
      ): (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px"}}
          className="flex gap-4 mt-10 overflow-x-auto snap-x snap-mandatory pb-4 
                  lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 
                  scrollbar-width:none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <motion.div className="min-w-xs lg:min-w-full" key={product.id} variants={cardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <p className="flex items-center justify-center gap-1 mt-6 font-serif text-sm font-medium text-gray-500 lg:hidden">
        <span>Swipe</span>
        
        <motion.span
          animate={{ x: [0, 6, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
        >
          <MdKeyboardDoubleArrowRight className="text-lg" />
        </motion.span>
      </p>
    </div>
  )
}

export default JuicyCollection
