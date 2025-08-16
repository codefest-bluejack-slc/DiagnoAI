import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';



const AuthorizedRoute = () => {
  const { isAuthenticated, me } = useAuth();
  
  if (isAuthenticated === null) {
    // return <LoadingScreen text='Navigating you' />;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }


  return <Outlet />
};

export default AuthorizedRoute;