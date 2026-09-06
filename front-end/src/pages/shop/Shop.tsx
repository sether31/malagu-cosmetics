import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "motion/react"
import type { ProductProps } from "../../components/ProductCard";
import { api } from "../../api/api";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import ProductSkeleton from "../../components/ProductSkeleton";

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

const Shop = () => {
  const [searchparams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const category = searchparams.get("category") || "";
  const subCategory = searchparams.get("sub") || "";
  const currentPage = parseInt(searchparams.get("page") || "1", 10);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 10);
      
      try {
        const res = await api.get("/products/get-products.php", {
          params: {
            category,
            sub_category: subCategory,
            page: currentPage,
            limit: 8
          }
        });

        setProducts(res.data.data)
        setTotalPages(res.data.pagination.totalPages)
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false)
      }
    }

    getProducts();
  }, [category, subCategory, currentPage]);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchparams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="px-6 py-12 mx-auto container-xl">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">
          {category ? category : "All Products"}
        </h1>
        {subCategory && (
          <p className="mt-2 text-gray-500">{subCategory}</p>
        )}
      </div>

      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <motion.div 
                key={`${category}-${subCategory}-${currentPage}`}
                variants={cardVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ): (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center col-span-full">
              <div className="font-serif text-xl text-primary">No products found</div>
              <p className="max-w-md text-sm text-gray-500">
                {subCategory || category 
                  ? `We couldn't find any items matching your active filters (${category} - ${subCategory}). Try clearing your filters or exploring another collection.`
                  : "We couldn't find the page or products you were looking for."}
              </p>
              
              <button
                onClick={() => setSearchParams({})}
                className="mt-2 px-6 py-2.5 bg-primary text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer active:scale-95 rounded-md"
              >
                Clear Filters & Reset
              </button>
            </div>
          )}
        </motion.div>
      )}

      {!isLoading  && totalPages >= 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default Shop
