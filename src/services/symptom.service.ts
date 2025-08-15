import { BaseService } from "./base.service";
import { Symptom, _SERVICE as SymptomCanisterService } from "../declarations/symptom/symptom.did";
import { createActor as createSymptomActor, canisterId as symptomCanisterId } from "../declarations/symptom";
import { canisterId as historyCanisterId } from "../declarations/history";
import { firstOrDefault } from "../utils/service-utils";

export class SymptomService extends BaseService<SymptomCanisterService> {

    constructor() {
        super(symptomCanisterId, createSymptomActor);
    }

    public async addSymptom(symptom: Symptom) : Promise<Symptom | null> {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }
            const response = await this.actor.addSymptom(principal,symptom,historyCanisterId);
            return firstOrDefault(response);
        } catch (error) {
            console.error("Error adding symptomp:", error);
            throw error;
        }
    }


}