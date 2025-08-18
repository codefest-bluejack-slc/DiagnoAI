import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { Loading } from '../components/common/loading';

const AuthorizedRoute = () => {
  const { isAuthenticated, me } = useAuth();
  
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loading />
      </div>
    );
  }

  if (isAuthenticated === false) {
    // return <Navigate to="/" replace />;
  }

  return <Outlet />
};

export default AuthorizedRoute;