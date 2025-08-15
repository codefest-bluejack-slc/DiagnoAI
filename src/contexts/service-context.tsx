import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { UserService } from "../services/user.service";
import { IServiceContextType } from "../interfaces/IServiceContextType";
import { ServiceContext } from "../hooks/use-service";
import { HistoryService } from "../services/history.service";
import { SymptompService } from "../services/symptomp.service";

export const ServiceProvider = ({ children } : { children: ReactNode }) => {
    const [userService, setUserService] = useState<UserService>(new UserService());
    const [historyService, setHistoryService] = useState<HistoryService>(new HistoryService());
    const [symptompService, setSymptompService] = useState<SymptompService>(new SymptompService());

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeServices = async () => {
            setLoading(true);

            await Promise.all([
                userService.ensureInitialized(),
                historyService.ensureInitialized(),
                symptompService.ensureInitialized(),
            ]);


            setLoading(false);
        };

        initializeServices();
    }, []);

    const value: IServiceContextType = useMemo(() => {
        return {
            userService: userService,
            historyService: historyService,
            symptompService: symptompService,
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
