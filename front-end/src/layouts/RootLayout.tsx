import { Outlet, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { useEffect, useLayoutEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout() {
  const { pathname } = useLocation();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);

  useLayoutEffect(() => {
    window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
    });
  }, [pathname]);
  

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}
