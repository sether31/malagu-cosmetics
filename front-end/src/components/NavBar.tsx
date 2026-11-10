import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUser } from "react-icons/fa6";
import { GiShoppingBag } from "react-icons/gi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdAccountCircle, MdKeyboardArrowDown } from "react-icons/md"; 
import { RiLogoutCircleLine } from "react-icons/ri";
import { useCategoryStore } from "../store/useCategoryStore";
import Cart from "./Cart";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import SearchInput from "./SearchInput";

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
  const { isAuthenticated, logout } = useAuthStore();
  const { fetchCategories, categories: categoryData } = useCategoryStore();

  // states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // shop dropdown states
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState<boolean>(false);
  const [isShopMobileExpanded, setIsShopMobileExpanded] = useState<boolean>(false); 

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState<boolean>(false);
  const [isAccountMobileExpanded, setIsAccountMobileExpanded] = useState<boolean>(false); 

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    setIsAccountDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
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
                        {categoryData.map((categoryObj: any) => (
                          <div key={categoryObj.name} className="flex flex-col gap-3 min-w-[120px]">
                            <Link
                              to={`/shop?category=${encodeURIComponent(categoryObj.name)}`}
                              onClick={() => setIsShopDropdownOpen(true)}
                              className="text-base font-bold tracking-wide text-primary hover:underline"
                            >
                              {categoryObj.name}
                            </Link>

                            <ul className="flex flex-col gap-2 text-sm text-gray-700">
                              {(categoryObj.subCategories || categoryObj.subcategories || []).map((subCategory: string) => (
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
              <SearchInput containerClassName="min-w-[220px]" limit={5} debounceMs={300} />

              {isAuthenticated ? (
                <div
                  className="relative pt-2"
                  onMouseEnter={() => setIsAccountDropdownOpen(true)}
                  onMouseLeave={() => setIsAccountDropdownOpen(false)}
                >
                  <NavLink to="/account" className="text-gray-800 transition-colors cursor-pointer hover:text-gray-900">
                    <FaUser className="text-xl" />
                  </NavLink>

                  <AnimatePresence>
                    {isAccountDropdownOpen && (
                      <motion.div
                        initial={{y: 10, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: 10, opacity: 0}}
                        transition={{duration: 0.2}}
                        className="absolute right-0 pt-4 top-full w-max"
                      >
                        <div className="flex flex-col gap-4 p-6 border border-gray-300 rounded-md bg-bgColor">
                          <NavLink 
                            to="/account"
                            className="flex items-center gap-1 text-sm tracking-wide text-gray-700 hover:text-gray-900"
                          >
                            <MdAccountCircle />
                            <span>Account</span>
                          </NavLink>

                          <button 
                            type="button"
                            onClick={() => handleLogout()}
                            className="flex items-center gap-1 text-sm tracking-wide text-gray-700 cursor-pointer hover:text-gray-900"
                          >
                            <RiLogoutCircleLine />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink to="/login" className="pt-2 text-gray-800 transition-colors cursor-pointer hover:text-gray-900">
                  <FaUser className="text-xl" />
                </NavLink>
              )}

              <button onClick={() => setIsCartOpen(!isCartOpen)} className="pt-2 text-gray-800 transition-colors cursor-pointer hover:text-gray-900">
                <GiShoppingBag className="text-xl" />
              </button>
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

            <button onClick={() => setIsCartOpen(!isCartOpen)} className="pt-2 text-gray-800 transition-colors cursor-pointer hover:text-gray-600">
              <GiShoppingBag className="text-xl" />
            </button>
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

              <div className="mb-6">
                <SearchInput containerClassName="w-full" limit={10} debounceMs={300} />
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
                        {categoryData.map((categoryObj: any) => (
                          <div key={categoryObj.name} className="flex flex-col gap-2">
                            <Link
                              to={`/shop?category=${encodeURIComponent(categoryObj.name)}`}
                              className="text-base font-semibold text-primary"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {categoryObj.name}
                            </Link>
                            <ul className="flex flex-col gap-2 pl-2 text-sm text-gray-600">
                              {(categoryObj.subCategories || categoryObj.subcategories || []).map((sub: string) => (
                                <li key={sub}>
                                  <Link
                                    to={`/shop?category=${encodeURIComponent(categoryObj.name)}&sub=${encodeURIComponent(sub)}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="hover:text-gray-900"
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
                
                <div className="flex flex-col gap-6 text-lg tracking-wide">
                  {isAuthenticated ? (
                    <>
                      <div 
                        onClick={() => setIsAccountMobileExpanded(!isAccountMobileExpanded)} 
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div>Account</div>
                        <MdKeyboardArrowDown 
                          className={`text-2xl transition-transform duration-300 ${isAccountMobileExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>

                      <AnimatePresence>
                        {isAccountMobileExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0}}
                            animate={{ height: "auto", opacity: 1}}
                            exit={{ height: 0, opacity: 0}}
                            className="flex flex-col gap-5 pl-4 mt-2 overflow-hidden border-l-2 border-gray-200"
                          >
                            <ul className="flex flex-col gap-2 pl-2 text-sm text-gray-600">
                              <NavLink 
                                to="/account"
                                className="flex items-center gap-1 tracking-wide text-gray-700 hover:text-gray-900"
                              >
                                <MdAccountCircle />
                                <span>Account</span>
                              </NavLink>

                              <button 
                                onClick={() => handleLogout()}
                                className="flex items-center gap-1 tracking-wide text-gray-700 cursor-pointer hover:text-gray-900"
                              >
                                <RiLogoutCircleLine />
                                <span>Logout</span>
                              </button>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Account</NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-40 bg-black/40" 
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 z-50 h-screen"
            >
              <Cart setIsCartOpen={setIsCartOpen} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;