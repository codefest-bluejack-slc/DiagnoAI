import { ActorSubclass, Principal } from "@ic-reactor/react/dist/types";
import { BaseService } from "./base.service";
import { _SERVICE as HistoryCanisterService, HistoryResponse, History } from "../declarations/history/history.did";
import { canisterId as historyCanisterId, createActor as createHistoryActor } from "../declarations/history";
import { canisterId as symptomCanisterId } from "../declarations/symptom";
import { IHealthAssessment } from "../interfaces/IDiagnostic";
import { IHistoryResponse, IMedicine, IHistory } from "../interfaces/IHistoryModal";

export class HistoryService extends BaseService<HistoryCanisterService> {

    constructor() {
        super(historyCanisterId, createHistoryActor);
    }

    public async getHistoryById(id: string): Promise<HistoryResponse | null> {
        try {
            const response = await this.actor.getHistoryWithSymptoms(id, symptomCanisterId);
            console.log("History fetched:", response);
            if ('ok' in response) {
                return response.ok;
            }
            return null;
        } catch (error) {
            console.error("Error fetching history by ID:", error);
            throw error;
        }
    }

    public async getMyHistories(): Promise<IHistoryResponse[]> {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }
            const response = await this.actor.getHistoryByUserId(principal);
            console.log("My histories fetched:", response);
            
            if ('ok' in response) {
                const historyPromises = response.ok.map(async (history) => {
                    try {
                        const historyWithSymptoms = await this.actor.getHistoryWithSymptoms(history.id, symptomCanisterId);
                        if ('ok' in historyWithSymptoms) {
                            return {
                                id: history.id,
                                userId: history.userId.toString(),
                                username: history.username,
                                diagnosis: history.diagnosis,
                                medicine_response: history.medicine_response,
                                medicines: history.medicines.map((med: any) => ({
                                    brand_name: med.brand_name,
                                    generic_name: med.generic_name,
                                    manufacturer: med.manufacturer,
                                    product_ndc: med.product_ncd
                                })),
                                symptoms: historyWithSymptoms.ok.symptoms.map(symptom => ({
                                    id: symptom.id,
                                    historyId: symptom.historyId,
                                    name: symptom.name,
                                    severity: symptom.severity
                                }))
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching symptoms for history ${history.id}:`, error);
                    }
                    
                    return {
                        id: history.id,
                        userId: history.userId.toString(),
                        username: history.username,
                        diagnosis: history.diagnosis,
                        medicine_response: history.medicine_response,
                        medicines: history.medicines.map((med: any) => ({
                            brand_name: med.brand_name,
                            generic_name: med.generic_name,
                            manufacturer: med.manufacturer,
                            product_ndc: med.product_ncd
                        })),
                        symptoms: []
                    };
                });
                
                const historyItems = await Promise.all(historyPromises);
                return historyItems.filter(item => item !== null);
            }
            return [];
        } catch (error) {
            console.error("Error fetching my histories:", error);
            throw error;
        }
    }

    public async addHistory(username: string, assessment: IHealthAssessment, diagnosis?: string): Promise<History | null> {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }
            
            const history: History = {
                id: assessment.id,
                userId: principal,
                username: username,
                diagnosis: diagnosis || "",
                medicines: [],
                medicine_response: "",
            };

            const response = await this.actor.addHistory(history);
            console.log(response);
            if (Array.isArray(response) && response.length > 0) {
                return response[0] || null;
            }
            return null;
        } catch (error) {
            console.error("error from add history", error);
            throw error;
        }
    }

    public async updateHistoryWithDiagnosis(id: string, diagnosis: string, medicineResponse: string, medicines: IMedicine[]): Promise<boolean> {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }

            const existingHistory = await this.getHistoryById(id);
            if (!existingHistory) {
                return false;
            }

            const updatedHistory: History = {
                id: id,
                userId: principal,
                username: existingHistory.username,
                diagnosis: diagnosis,
                medicines: medicines.map(med => ({
                    brand_name: med.brand_name,
                    generic_name: med.generic_name,
                    manufacturer: med.manufacturer,
                    product_ncd: med.product_ndc
                })),
                medicine_response: medicineResponse,
            };

            const response = await this.actor.updateHistory(id, updatedHistory);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async updateHistory(id: string, updates: Partial<IHealthAssessment>): Promise<boolean> {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }

            const existingHistory = await this.getHistoryById(id);
            if (!existingHistory) {
                return false;
            }

            const updatedHistory: History = {
                id: id,
                userId: principal,
                username: existingHistory.username,
                diagnosis: existingHistory.diagnosis,
                medicines: existingHistory.medicines,
                medicine_response: existingHistory.medicine_response,
            };

            const response = await this.actor.updateHistory(id, updatedHistory);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async deleteHistory(id: string): Promise<boolean> {
        try {
            const response = await this.actor.deleteHistory(id);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}