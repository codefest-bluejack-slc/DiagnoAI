import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { UserService } from "../services/user.service";
import { IServiceContextType } from "../interfaces/IServiceContextType";
import { ServiceContext } from "../hooks/use-service";
import { HistoryService } from "../services/history.service";
import { SymptomService } from "../services/symptom.service";
import { TransitionProvider } from "../components/animations/diagonal-transition";

export const ServiceProvider = ({ children } : { children: ReactNode }) => {
    const [userService, setUserService] = useState<UserService>(new UserService());
    const [historyService, setHistoryService] = useState<HistoryService>(new HistoryService());
    const [symptomService, setSymptomService] = useState<SymptomService>(new SymptomService());

    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<string>("loading");

    useEffect(() => {
        const initializeServices = async () => {
            setLoading(true);

            await Promise.all([
                userService.ensureInitialized(),
                historyService.ensureInitialized(),
                symptomService.ensureInitialized(),
            ]);

            setLoading(false);
            setTimeout(() => {
                setCurrentPage("loaded");
            }, 100);
        };

        initializeServices();
    }, []);

    const value: IServiceContextType = useMemo(() => {
        return {
            userService: userService,
            historyService: historyService,
            symptomService: symptomService,
        };
    }, [userService]);

    const handlePageChange = (page: string) => {
        setCurrentPage(page);
    };

    return (
        <TransitionProvider currentPage={currentPage} onPageChange={handlePageChange}>
            <ServiceContext.Provider value={value}>
                {children}
            </ServiceContext.Provider>
        </TransitionProvider>
    );
};
