import { createContext, useContext } from "react";
import { IServiceContextType } from "../interfaces/IServiceContextType";

export const ServiceContext = createContext<IServiceContextType | null>(null);

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within ServiceProvider');
  }
  return context;
};
