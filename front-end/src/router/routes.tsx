import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import LandingPage from "../pages/landing/LandingPage";
import Shop from "../pages/shop/Shop";
import Register from "../pages/auth/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "../pages/auth/Login";
import ProductDetails from "../pages/product/ProductDetails";

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
        path: "/shop", 
        element: <Shop />,
      },
      {
        path: "product/:slug",
        element: <ProductDetails />
      }
    ],
  },
  {
    path: "/register",
    element: (
      <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
        <Register />
      </GoogleOAuthProvider>
    )
  },
  {
    path: "/login",
    element: (
      <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
        <Login  />
      </GoogleOAuthProvider>
    )
  }
]);