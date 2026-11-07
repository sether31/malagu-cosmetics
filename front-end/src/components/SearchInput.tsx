import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";
import { apiPrivate } from "../api/api";

interface SearchProduct {
  id: number | string;
  name: string;
  price: number;
  image: string;
}

interface SearchInputProps {
  containerClassName?: string;
  limit?: number;
  debounceMs?: number;
}

const createProductSlug = (id: number | string, name: string) => {
  const slugName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${id}-${slugName}`;
};

const SearchInput = ({
  containerClassName = "min-w-[230px]",
  limit = 5,
  debounceMs = 300,
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const isLabelFloating = isSearchFocused || searchValue.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  useEffect(() => {
    const query = searchValue.trim();
    if (!query) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await apiPrivate.get(
          `/products/search.php?q=${encodeURIComponent(query)}&limit=${limit}`
        );
        if (res.data.success) {
          setSuggestions(res.data.products || []);
        }
      } catch (error) {
        console.error("Search suggestion error:", error);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, limit, debounceMs]);

  return (
    <div ref={searchRef} className={`relative ${containerClassName}`}>
      <form
        className="relative border-b border-gray-400 pt-3 pb-1.5 px-2 flex items-center w-full"
      >
        <input
          type="text"
          id="search-input"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          className="z-10 w-full pr-12 text-xs bg-transparent outline-none text-primary"
        />

        <motion.label
          htmlFor="search-input"
          className="absolute left-0 z-0 text-gray-800 pointer-events-none"
          initial={false}
          animate={{
            y: isLabelFloating ? -18 : 0,
            fontSize: isLabelFloating ? "10px" : "12px",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          What are you looking for?
        </motion.label>

        <div className="absolute right-0 flex items-center gap-1.5 z-10">
          <AnimatePresence>
            {searchValue && (
              <motion.button
                type="button"
                className="cursor-pointer"
                onClick={() => setSearchValue("")}
              >
                <IoMdClose className="text-lg text-gray-700" />
              </motion.button>
            )}
          </AnimatePresence>

          <button type="submit" className="flex items-center cursor-pointer focus:outline-none">
            <IoSearch className="text-2xl text-gray-800 shrink-0" />
          </button>
        </div>
      </form>

      {/* suggestion */}
      <AnimatePresence>
        {isSearchFocused && searchValue.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 z-50 mt-2 overflow-hidden bg-white border border-gray-300 rounded-md shadow-lg"
          >
            {isSearching ? (
              <div className="p-4 text-xs text-center text-gray-500">Searching...</div>
            ) : suggestions.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-100">
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${createProductSlug(item.id, item.name)}`}
                    onClick={() => {
                      setIsSearchFocused(false);
                      setSearchValue("");
                    }}
                    className="flex items-center gap-3 p-3 transition-colors hover:bg-gray-50"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="object-cover w-10 h-10 duration-300 ease-in-out border border-gray-200 rounded hover:scale-105"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-900 truncate">
                        {item.name}
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        ₱{item.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-xs text-center text-gray-500">No products found.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;