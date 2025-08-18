import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { Loading } from '../components/common/loading';
import { useEffect, useRef } from 'react';
import { useToastContext } from '../contexts/toast-context';

const AuthorizedRoute = () => {
  const { isAuthenticated, me, login } = useAuth();
  const { addToast } = useToastContext();
  const hasShownWelcomeToast = useRef(false);
  
  useEffect(() => {
    if (isAuthenticated === false) {
      login.mutate();
      hasShownWelcomeToast.current = false;
    }
  }, [isAuthenticated, login]);

  useEffect(() => {
    if (isAuthenticated === true && me && !hasShownWelcomeToast.current) {
      addToast(`Welcome back, ${me.name || 'User'}!`, {
        type: "success",
        title: "Login Successful",
        duration: 4000
      });
      hasShownWelcomeToast.current = true;
    }
  }, [isAuthenticated, me, addToast]);
  
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loading />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loading />
      </div>
    );
  }

  return <Outlet />
};

export default AuthorizedRoute;