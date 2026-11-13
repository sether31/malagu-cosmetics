import Lenis from "lenis";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./router/routes";
import { ToastContainer } from "react-toastify";
import { useCart } from "./store/useCart";
import { useCategoryStore } from "./store/useCategoryStore";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const { fetchCart } = useCart();
  const { fetchCategories } = useCategoryStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    Promise.all([fetchCart(), fetchCategories()]).finally(() => {
      setIsInitialized(true);
    });
  }, [fetchCart, fetchCategories]);

  if (!isInitialized) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-screen min-h-screen gap-4 bg-white">
      <div
        className="w-12 h-12 border-4 rounded-full border-stone-200 border-t-secondary animate-spin"
      />
    </div>
  );
}

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        toastClassName="!w-[calc(100vw-2rem)] sm:!w-[350px] !mx-auto sm:!mx-0 !mt-3 sm:!mt-0 !rounded-lg !text-sm"
      />
    </>
  )
}

export default App
