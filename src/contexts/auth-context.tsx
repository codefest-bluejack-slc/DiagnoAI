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
    const [ isAuthenticated, setIsAuthenticated ] = useState<Boolean | null>(null);

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
        })

    const fetchUser = useMutation({
            mutationFn: () => userService.me(),
            onSuccess: (data) => {
                console.log('Fetched user:', data);
                setUser(data);
                setIsAuthenticated(!!data);
            },
            onError: (error) => {
                console.error('Failed to fetch user:', error);
                setUser(null);
                setIsAuthenticated(false);
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
        fetchUser.mutate();
    }, []);

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
