import { createContext, useContext, useEffect, useState } from "react";
import { useService } from "../hooks/use-service";
import { useMutation } from "../hooks/use-mutation";
import { User } from "../declarations/user/user.did";
import { AuthContext } from "../hooks/use-auth";
  
interface AuthProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProps) {
    const [user, setUser] = useState<User | null>(null);
    const { userService } = useService();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const login = useMutation({
        mutationFn: () => userService.login(),
        onSuccess: (data) => {
            setUser(data);
            setIsAuthenticated(true);
        },
        onError: (error) => {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
        }
    });

    const fetchUser = useMutation({
        mutationFn: () => userService.me(),
        onSuccess: (data) => {
            setUser(data);
            setIsAuthenticated(!!data);
        },
        onError: (error) => {
            if (error && typeof error === 'object' && 'message' in error && 
                typeof (error as any).message === 'string' && 
                (error as any).message.includes("Certificate verification")) {
                console.warn('Certificate verification failed, user will remain unauthenticated');
                setUser(null);
                setIsAuthenticated(false);
            } else {
                console.error('Failed to fetch user:', error);
                setUser(null);
                setIsAuthenticated(false);
            }
        }
    });

    const logout = useMutation({
        mutationFn: () => userService.logout(),
        onSuccess: () => {
            setUser(null);
            setIsAuthenticated(false);
        },
        onError: (error) => {
            console.error('Logout failed:', error);
        }
    });

    useEffect(() => {
        if (userService) {
            fetchUser.mutate();
        }
    }, [userService]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (userService && isAuthenticated === true && !user) {
                const currentUser = await userService.me();
                if (!currentUser) {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
        };

        const interval = setInterval(checkAuthStatus, 30000);
        return () => clearInterval(interval);
    }, [userService, isAuthenticated, user]);

  return (
    <AuthContext.Provider
      value={
        {
            me: user,
            setUser: setUser,
            isAuthenticated : isAuthenticated,
            login: login,
            logout: logout,
            getCurrentUser : fetchUser
        }
      }
    >
      {children}
    </AuthContext.Provider>
  );
}
