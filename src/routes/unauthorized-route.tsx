import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { Loading } from '../components/common/loading';

const UnAuthorizedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loading />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default UnAuthorizedRoute;
