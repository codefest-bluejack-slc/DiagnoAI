import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { UserService } from "../services/user.service";
import { IServiceContextType } from "../interfaces/IServiceContextType";
import { ServiceContext } from "../hooks/use-service";
import { HistoryService } from "../services/history.service";
import { SymptomService } from "../services/symptom.service";

export const ServiceProvider = ({ children } : { children: ReactNode }) => {
    const [userService, setUserService] = useState<UserService | null>(null);
    const [historyService, setHistoryService] = useState<HistoryService | null>(null);
    const [symptomService, setSymptomService] = useState<SymptomService | null>(null);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeServices = async () => {
            try {
                setLoading(true);
                const newUserService = new UserService();
                const newHistoryService = new HistoryService();
                const newSymptomService = new SymptomService();

                await Promise.all([
                    newUserService.ensureInitialized(),
                    newHistoryService.ensureInitialized(),
                    newSymptomService.ensureInitialized()
                ]);
                
                setUserService(newUserService);
                setHistoryService(newHistoryService);
                setSymptomService(newSymptomService);
            } catch (error) {
                console.error("Failed to initialize services:", error);
                const newUserService = new UserService();
                const newHistoryService = new HistoryService();
                const newSymptomService = new SymptomService();
                
                setUserService(newUserService);
                setHistoryService(newHistoryService);
                setSymptomService(newSymptomService);
            } finally {
                setLoading(false);
            }
        };

        initializeServices();
    }, []);

    const value: IServiceContextType | null = useMemo(() => {
        if (!userService || !historyService || !symptomService) {
            return null;
        }
        return {
            userService,
            historyService,
            symptomService,
        };
    }, [userService, historyService, symptomService]);

    if (loading || !value) {
        return <div></div>;
    }

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};
