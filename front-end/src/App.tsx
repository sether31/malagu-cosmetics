import Lenis from "lenis";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./router/routes";
import { ToastContainer } from "react-toastify";
import { useCart } from "./store/useCart";

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

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer />
    </>
  )
}

export default App
