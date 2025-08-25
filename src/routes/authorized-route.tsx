import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { Loading } from '../components/common/loading';
import { useEffect, useRef } from 'react';
import { useToastContext } from '../contexts/toast-context';

const AuthorizedRoute = () => {
  const { isAuthenticated, me } = useAuth();
  const { addToast } = useToastContext();
  const hasShownWelcomeToast = useRef(false);

  // useEffect(() => {
  //   if (isAuthenticated === true && me && !hasShownWelcomeToast.current) {
  //     addToast(`Welcome back, ${me.name || 'User'}!`, {
  //       type: "success",
  //       title: "Login Successful",
  //       duration: 3000
  //     });
  //     hasShownWelcomeToast.current = true;
  //   } else if (isAuthenticated === false) {
  //     hasShownWelcomeToast.current = false;
  //   }
  // }, [isAuthenticated, me, addToast]);

  // if (isAuthenticated === null) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
  //       <Loading />
  //     </div>
  //   );
  // }

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthorizedRoute;
