import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';


const UnAuthorizedRoute: React.FC = ( ) => {

  const { isAuthenticated } = useAuth(); 
  
  if (isAuthenticated === null) {
  }
  
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default UnAuthorizedRoute;