import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUser } from "react-icons/fa6";
import { GiShoppingBag } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdKeyboardArrowDown } from "react-icons/md"; 
import { api } from "../api/api";
import { useCategoryStore } from "../store/useCategoryStore";

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={({ isActive }) =>
        `relative py-1 transition-colors duration-200 text-primary ${
          isActive ? "font-semibold" : "hover:text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <motion.span
            className="absolute bottom-0 left-0 h-[1.5px] w-full bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive || isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ originX: 0 }}
          />
        </>
      )}
    </NavLink>
  );
};

const NavBar = () => {
  // data
  const { fetchCategories, categories: categoryData, isLoading } = useCategoryStore();

  // states
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // shop dropdown states
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isShopMobileExpanded, setIsShopMobileExpanded] = useState(false); 

  const isLabelFloating = isSearchFocused || searchValue.trim().length > 0;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <>
      <div className="py-2 bg-banner">
        <h2 className="flex justify-center gap-1 text-xs tracking-wide">
          <span>FREE SHIPPING ON ORDERS OVER ₱499</span>
          <Link to="/shop" className="italic underline cursor-pointer hover:text-gray-600">
            Shop Now
          </Link>
        </h2>
      </div>

      <header className="sticky top-0 left-0 z-40 w-full border-b border-gray-300 bg-bgColor">
        <div className="container-xl">
          {/* desktop */}
          <nav className="items-center justify-between hidden gap-4 py-4 text-sm lg:flex">
            {/* left section nav */}
            <div className="flex items-center gap-6">
              <NavItem to="/">Home</NavItem>
              
              {/* shop */}
              <div
                className="relative"
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => setIsShopDropdownOpen(false)}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  <Link to="/shop">Shop All</Link>
                  {categoryData.length > 0 && (
                    <MdKeyboardArrowDown
                      className={`text-lg duration-200 transition-transform ease-in-out ${isShopDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>

                <AnimatePresence>
                  {isShopDropdownOpen && categoryData.length > 0 && (
                    <motion.div
                      initial={{y: 10, opacity: 0}}
                      animate={{y: 0, opacity: 1}}
                      exit={{y: 10, opacity: 0}}
                      transition={{duration: 0.2}}
                      className="absolute left-0 pt-4 top-full w-max"
                    >
                      <div className="flex gap-8 p-6 border border-gray-300 rounded-md bg-bgColor">
                        {categoryData.map((categoryObj) => (
                          <div key={categoryObj.name} className="flex flex-col gap-3 min-w-[120px]">
                            <Link
                              to={`/shop?category=${encodeURIComponent(categoryObj.name)}`}
                              onClick={() => setIsShopDropdownOpen(true)}
                              className="text-base font-bold tracking-wide text-primary hover:underline"
                            >
                              {categoryObj.name}
                            </Link>

                            <ul className="flex flex-col gap-2 text-sm text-gray-700">
                              {categoryObj.subCategories.map((subCategory) => (
                                <li key={subCategory}>
                                  <Link
                                    to={`/shop?category=${encodeURIComponent(categoryObj.name)}&sub=${encodeURIComponent(subCategory)}`}
                                    onClick={() => setIsShopDropdownOpen(false)}
                                    className="hover:text-primary"
                                  >
                                    {subCategory}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavItem to="/frequently-asked-question">FAQs</NavItem>
              <NavItem to="/shade-guide">Shade Guide</NavItem>

              {/* logo */}
              <NavLink to="/" className="flex flex-col ml-10 font-serif tracking-tight text-center">
                <span className="text-2xl font-black tracking-widest text-primary">MALAGU</span>
                <span className="text-[10px] tracking-widest text-gray-700">COSMETICS</span>
              </NavLink>
            </div>

            {/* right section nav */}
            <div className="flex items-center gap-6">
              <form onSubmit={handleSearch} className="relative border-b border-gray-400 pt-3 pb-1.5 px-2 flex items-center min-w-[210px]">
                <input
                  type="text"
                  id="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="z-10 w-full pr-12 text-xs bg-transparent outline-none text-primary"
                />

                <motion.label
                  htmlFor="search"
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
                      <motion.button type="button" className="cursor-pointer" onClick={() => setSearchValue("")}>
                        <IoMdClose className="text-lg" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <button type="submit" className="flex items-center focus:outline-none">
                    <IoSearch className="text-2xl text-gray-800 cursor-pointer shrink-0" />
                  </button>
                </div>
              </form>

              <NavLink to="/account" className="pt-2 text-gray-800 transition-colors hover:text-gray-600">
                <FaUser className="text-xl" />
              </NavLink>
              <NavLink to="/cart" className="pt-2 text-gray-800 transition-colors hover:text-gray-600">
                <GiShoppingBag className="text-xl" />
              </NavLink>
            </div>
          </nav>


          {/* mobile */}
          <nav className="flex items-center justify-between gap-4 py-4 lg:hidden">
            <RxHamburgerMenu 
              className="text-2xl text-gray-800 cursor-pointer" 
              onClick={() => setIsMobileMenuOpen(true)}
            />
            
            <NavLink to="/" className="flex flex-col font-serif tracking-tight text-center">
              <span className="text-2xl font-black tracking-widest text-primary">MALAGU</span>
              <span className="text-[10px] tracking-widest text-gray-500">COSMETICS</span>
            </NavLink>

            <NavLink to="/cart" className="text-gray-800">
              <GiShoppingBag className="text-2xl" />
            </NavLink>
          </nav>
        </div>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-[80%] max-w-[300px] h-screen bg-bgColor z-50 shadow-2xl flex flex-col p-6 overflow-y-auto lg:hidden"
            >
              {/* close btn */}
              <div className="flex justify-end mb-8">
                <IoMdClose 
                  className="text-3xl text-gray-800 cursor-pointer" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                />
              </div>

              {/* links */}
              <div className="flex flex-col gap-6 text-lg tracking-wide">
                <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                
                {/* shop all */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between cursor-pointer">
                    <NavLink to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop All</NavLink>
                    {categoryData.length > 0 && (
                      <MdKeyboardArrowDown 
                        className={`text-2xl transition-transform duration-300 ${isShopMobileExpanded ? 'rotate-180' : ''}`}
                        onClick={() => setIsShopMobileExpanded(!isShopMobileExpanded)} 
                      />
                    )}
                  </div>

                  <AnimatePresence>
                    {isShopMobileExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-5 pl-4 mt-2 overflow-hidden border-l-2 border-gray-200"
                      >
                        {categoryData.map((categoryObj) => (
                          <div key={categoryObj.name} className="flex flex-col gap-2">
                            <Link
                              to={`/shop?category=${encodeURIComponent(categoryObj.name)}`}
                              className="text-base font-semibold text-primary"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {categoryObj.name}
                            </Link>
                            <ul className="flex flex-col gap-2 pl-2 text-sm text-gray-600">
                              {categoryObj.subCategories.map((sub) => (
                                <li key={sub}>
                                  <Link
                                    to={`/shop?category=${encodeURIComponent(categoryObj.name)}&sub=${encodeURIComponent(sub)}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink to="/frequently-asked-question" onClick={() => setIsMobileMenuOpen(false)}>FAQs</NavLink>
                <NavLink to="/shade-guide" onClick={() => setIsMobileMenuOpen(false)}>Shade Guide</NavLink>
                
                <hr className="my-2 border-gray-300" />
                
                <NavLink to="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                  <FaUser /> Account
                </NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;