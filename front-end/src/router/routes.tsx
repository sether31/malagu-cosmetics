import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage";


export const routes = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  }
])