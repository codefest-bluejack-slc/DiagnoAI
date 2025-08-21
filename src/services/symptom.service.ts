import { BaseService } from "./base.service";
import { Symptom, _SERVICE as SymptomCanisterService } from "../declarations/symptom/symptom.did";
import { createActor as createSymptomActor, canisterId as symptomCanisterId } from "../declarations/symptom";
import { canisterId as historyCanisterId } from "../declarations/history";
import { firstOrDefault } from "../utils/service-utils";
import { ISymptom } from "../interfaces/IDiagnostic";

export class SymptomService extends BaseService<SymptomCanisterService> {

    constructor() {
        super(symptomCanisterId, createSymptomActor);
    }

    public async addSymptom(symptom: Symptom): Promise<Symptom | null> {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }
            const response = await this.actor.addSymptom(principal, symptom, historyCanisterId);
            return firstOrDefault(response);
        } catch (error) {
            console.error("Error adding symptom:", error);
            throw error;
        }
    }

    public async getSymptomsByHistoryId(historyId: string): Promise<ISymptom[]> {
        try {
            const response = await this.actor.getSymptomsByHistoryId(historyId);
            return response.map(symptom => ({
                name: symptom.name,
                severity: symptom.severity as 'mild' | 'moderate' | 'severe'
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async updateSymptom(id: string, symptom: Symptom): Promise<boolean> {
        try {
            const response = await this.actor.updateSymptoms(id, symptom);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async deleteSymptom(id: string): Promise<boolean> {
        try {
            const response = await this.actor.deleteSymptoms(id);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getAllSymptoms(): Promise<Symptom[]> {
        try {
            const response = await this.actor.getAllSymptoms();
            return response.map(([_, symptom]) => symptom);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}