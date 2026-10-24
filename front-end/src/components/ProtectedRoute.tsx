import { useAuthStore } from '../store/useAuthStore'
import PageLoader from './PageLoader';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if(isLoading) return <PageLoader />


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute
