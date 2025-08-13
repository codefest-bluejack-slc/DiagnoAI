import { createContext, useContext } from "react";
import { IAuthContextType } from "../interfaces/IAuthContextType";

export const AuthContext = createContext<IAuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
