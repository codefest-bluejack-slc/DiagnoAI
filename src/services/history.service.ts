import { ActorSubclass, Principal } from "@ic-reactor/react/dist/types";
import { BaseService } from "./base.service";
import { _SERVICE as HistoryCanisterService, HistoryResponse, History } from "../declarations/history/history.did";
import { canisterId as historyCanisterId, createActor as createHistoryActor } from "../declarations/history";
import { canisterId as symptomCanisterId } from "../declarations/symptom";
import { IHealthAssessment } from "../interfaces/IDiagnostic";
import { IHistoryItem } from "../interfaces/IHistoryModal";

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

    public async getMyHistories(): Promise<IHistoryItem[]> {
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
                                description: history.description,
                                since: history.since,
                                status: history.status as 'completed' | 'in-progress',
                                severity: history.severity as 'mild' | 'moderate' | 'severe',
                                diagnosis: history.diagnosis ? history.diagnosis[0] : undefined,
                                symptoms: historyWithSymptoms.ok.symptoms.map(symptom => ({
                                    name: symptom.name,
                                    severity: symptom.severity as 'mild' | 'moderate' | 'severe'
                                }))
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching symptoms for history ${history.id}:`, error);
                    }
                    
                    return {
                        id: history.id,
                        description: history.description,
                        since: history.since,
                        status: history.status as 'completed' | 'in-progress',
                        severity: history.severity as 'mild' | 'moderate' | 'severe',
                        diagnosis: history.diagnosis ? history.diagnosis[0] : undefined,
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

    public async addHistory(assessment: IHealthAssessment): Promise<History | null> {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }
            
            const history: History = {
                id: assessment.id,
                userId: principal,
                description: assessment.description,
                since: assessment.since,
                status: 'in-progress',
                severity: assessment.symptoms.length > 0 ? assessment.symptoms[0].severity : 'mild',
                diagnosis: []
            };

            const response = await this.actor.addHistory(history);
            console.log(response);
            return response || null;
        } catch (error) {
            console.error("error bang dari add history", error);
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
                description: updates.description || existingHistory.description,
                since: updates.since || existingHistory.since,
                status: 'in-progress',
                severity: updates.symptoms && updates.symptoms.length > 0 ? updates.symptoms[0].severity : existingHistory.severity,
                diagnosis: []
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