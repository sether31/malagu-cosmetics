import Lenis from "lenis";
import { useEffect } from "react";
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

  useEffect(() => {
    fetchCart();
    fetchCategories();
  }, [fetchCart, fetchCategories]);

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
