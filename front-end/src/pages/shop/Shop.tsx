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
    y: 0,
    transition: {
      type: "spring", stiffness: 300, damping: 24
    }
  }
}

const CATEGORY_STRUCTURE: Record<string, string[]> = {
  "Eyes": ["Eyeliner", "Eyeshadow"],
  "Face": ["Concealer", "Face Palette", "Setting Spray"],
  "Lips": ["Lip Oil", "Lip Pencil", "Lipstick"]
};

const Shop = () => {
  const [searchparams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const category = searchparams.get("category") || "";
  const subCategory = searchparams.get("sub") || "";
  const sortOption = searchparams.get("sort") || "";
  const currentPage = parseInt(searchparams.get("page") || "1", 10);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      
      try {
        const res = await api.get("/products/get-products.php", {
          params: {
            category,
            sub_category: subCategory,
            sort: sortOption,
            page: currentPage,
            limit: 8
          }
        });

        setProducts(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, [category, subCategory, sortOption, currentPage]);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchparams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);

    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleFilterSelect = (selectedCategory: string, selectedSub?: string) => {
    const newParams = new URLSearchParams(searchparams);
    if (selectedCategory) {
      newParams.set("category", selectedCategory);
    } else {
      newParams.delete("category");
      newParams.delete("sub");
    }
    
    if (selectedSub !== undefined) {
      if (selectedSub) {
        newParams.set("sub", selectedSub);
      } else {
        newParams.delete("sub");
      }
    } else {
      newParams.delete("sub");
    }

    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchparams);
    const val = e.target.value;
    if (val) {
      newParams.set("sort", val);
    } else {
      newParams.delete("sort");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="px-6 py-12 mx-auto max-w-7xl">
      {/* filter pill */}
      <div className="mb-10 space-y-4">
        {/* category */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => handleFilterSelect("")}
            className={`px-5 py-2 text-xs uppercase tracking-wider rounded-md transition-all cursor-pointer ${
              !category 
                ? "bg-primary text-white" 
                : "text-primary/80 hover:text-primary"
            }`}
          >
            All Products
          </button>
          {Object.keys(CATEGORY_STRUCTURE).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleFilterSelect(cat, "")}
              className={`px-5 py-2 text-xs uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                category === cat
                  ? "bg-primary text-white"
                  : "text-primary/80 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* sub category */}
        {category && CATEGORY_STRUCTURE[category] && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center max-w-xl gap-2 pt-2 mx-auto border-t border-gray-100"
          >
            <button
              type="button"
              onClick={() => handleFilterSelect(category, "")}
              className={`px-3 py-1 text-xs rounded-md transition-all cursor-pointer ${
                !subCategory 
                  ? "font-medium text-primary underline underline-offset-4" 
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              All {category}
            </button>
            {CATEGORY_STRUCTURE[category].map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => handleFilterSelect(category, sub)}
                className={`px-3 py-1 text-xs rounded-md transition-all cursor-pointer ${
                  subCategory === sub 
                    ? "font-medium text-primary underline underline-offset-4" 
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {sub}
              </button>
            ))}
          </motion.div>
        )}

        {/* sort by price */}
        <div className="flex justify-end max-w-6xl px-2 pt-2 mx-auto">
          <div className="flex items-center gap-2">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="px-3 py-2 text-[10px] tracking-wider uppercase bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-primary"
            >
              <option value="">Sort By</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {products.length > 0 ? (
            products.map((product, index) => (
              <motion.div 
                key={`${index}-${category}-${subCategory}-${sortOption}-${currentPage}`}
                variants={cardVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center col-span-full">
              <div className="font-serif text-xl text-primary">No products found</div>
              <p className="max-w-md text-sm text-gray-500">
                {subCategory || category || sortOption
                  ? `We couldn't find any items matching your active filters. Try clearing your filters or exploring another collection.`
                  : "We couldn't find the products you were looking for."}
              </p>
              
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="mt-2 px-6 py-2.5 bg-primary text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer active:scale-95 rounded-md"
              >
                Clear Filters & Reset
              </button>
            </div>
          )}
        </motion.div>
      )}

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default Shop;