import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import LandingPage from "../pages/landing/LandingPage";
import Shop from "../pages/shop/Shop";
import Register from "../pages/auth/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "../pages/auth/Login";
import ProductDetails from "../pages/product/ProductDetails";
import Account from "../pages/account/Account";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ShadeGuide from "../pages/shade-guide/ShadeGuide";
import FAQ from "../pages/Faq/Faq";

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
      },
      {
        path: "/account",
        element: <Account />
      },
      {
        path: "/shade-guide",
        element: <ShadeGuide />
      },
      {
        path: "/frequently-asked-question",
        element: <FAQ />
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
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  }
]);