import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { UserService } from "../services/user.service";
import { IServiceContextType } from "../interfaces/IServiceContextType";
import { ServiceContext } from "../hooks/use-service";
import { HistoryService } from "../services/history.service";
import { SymptomService } from "../services/symptom.service";

export const ServiceProvider = ({ children } : { children: ReactNode }) => {
    const [userService, setUserService] = useState<UserService>(new UserService());
    const [historyService, setHistoryService] = useState<HistoryService>(new HistoryService());
    const [symptomService, setSymptomService] = useState<SymptomService>(new SymptomService());

    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<string>("loading");

    useEffect(() => {
        const initializeServices = async () => {
            setLoading(true);
            const userService = new UserService();
            const historyService = new HistoryService();
            const symptomService = new SymptomService();

            await Promise.all([
                userService.ensureInitialized(),
                historyService.ensureInitialized(),
                symptomService.ensureInitialized()
            ]);
            setUserService(userService);
            setHistoryService(historyService);
            setSymptomService(symptomService);

            
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

    if (loading) {
<<<<<<< HEAD
        return <div></div>;
=======
        return (
            <div className="loading-screen">
                <h1>Loading...</h1>
            </div>
        );
>>>>>>> dd118dcf59b07b7721eaa1650de646cc2a7c2667
    }

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};
