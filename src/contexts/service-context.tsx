import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { UserService } from "../services/user.service";
import { IServiceContextType } from "../interfaces/IServiceContextType";
import { ServiceContext } from "../hooks/use-service";

export const ServiceProvider = ({ children } : { children: ReactNode }) => {
    const [userService, setUserService] = useState<UserService>(new UserService());
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeServices = async () => {
            setLoading(true);
            const user = new UserService();

            await Promise.all([
                user.ensureInitialized(),
            ]);

            setUserService(user);
            setLoading(false);
        };

        initializeServices();
    }, []);

    const value: IServiceContextType = useMemo(() => {
        return {
            userService: userService,
        };
    }, [userService]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};
