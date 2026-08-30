import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { api } from "../../../api/api"
import ProductCard, { type ProductProps } from "../../../components/ProductCard"


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
      type: "spring", stiffness: 300, damping: 24
    }
  }
}

const JuicyCollection = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get('/products/get-products.php?sub_category=Lip Oil&limit=4');
        
        setProducts(res.data.data)
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }

    getProducts();
  }, [])

  
  return (
    <div className="pt-20 pb-32 container-xl">
      <h1 className="font-serif text-3xl font-medium leading-tight text-center md:text-4xl">
        The Juicy Collections
      </h1>

      {products.length > 0 && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true , margin: "-50px"}}
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
    </div>
  )
}

export default JuicyCollection
