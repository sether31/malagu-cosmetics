import { Outlet, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { useLayoutEffect } from 'react';

export default function RootLayout() {
  const { pathname } = useLocation();

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
