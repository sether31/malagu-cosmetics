import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import LandingPage from "../pages/landing/LandingPage";
import Shop from "../pages/shop/Shop";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, 
        element: <LandingPage />,
      },
      {
        path: "shop", 
        element: <Shop />,
      }
    ],
  },
]);