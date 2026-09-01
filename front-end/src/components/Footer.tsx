import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategoryStore } from "../store/useCategoryStore";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

export default function Footer() {
  const { fetchCategories, categories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <footer className="w-full bg-[#121619] text-gray-300 border-t border-gray-800 pt-16 pb-8">
      <div className="grid grid-cols-1 gap-10 px-6 mx-auto container-xl md:grid-cols-3 lg:gap-16">
        
        {/* brand */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex flex-col font-serif tracking-tight">
            <span className="text-2xl font-black tracking-widest text-white">MALAGU</span>
            <span className="text-[10px] tracking-widest text-gray-400">COSMETICS</span>
          </Link>
          <p className="max-w-sm text-xs leading-relaxed text-gray-400">
            This is a conceptual project built for educational purposes. All product images and trademarks belong to their respective owners. No actual products are sold here.
          </p>
          <div className="flex items-center gap-4 mt-2 text-gray-400">
            <a href="#" className="transition-colors hover:text-white"><FaInstagram size={18} /></a>
            <a href="#" className="transition-colors hover:text-white"><FaFacebookF size={16} /></a>
            <a href="#" className="transition-colors hover:text-white"><FaTiktok size={16} /></a>
          </div>
        </div>

        {/* quick links */}
        <div className="flex flex-col items-start md:items-center">
          <div className="w-full max-w-[160px]">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Quick Links</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li><Link to="/shop" className="transition-colors hover:text-white">Shop Collection</Link></li>
              <li><Link to="/frequently-asked-question" className="transition-colors hover:text-white">FAQ</Link></li>
              <li><Link to="/shade-guide" className="transition-colors hover:text-white">Shade Guide</Link></li>
            </ul>
          </div>
        </div>

        {/* categories */}
        <div className="flex flex-col items-start md:items-center">
          <div className="w-full max-w-[160px]">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Categories</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="transition-colors hover:text-white">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* copyright */}
      <div className="flex flex-col items-center justify-between gap-4 px-6 pt-6 mx-auto mt-12 text-xs text-gray-500 border-t container-xl border-gray-800/80 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Malagu Cosmetics</p>
        <div className="flex gap-6">
          <a href="#" className="cursor-pointer hover:underline">Privacy Policy</a>
          <a href="#" className="cursor-pointer hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}