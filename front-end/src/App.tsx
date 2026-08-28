import Lenis from "lenis";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./router/routes";

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

  return (
    <RouterProvider router={routes} />
  )
}

export default App
