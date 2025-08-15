import { ActorSubclass, Principal } from "@ic-reactor/react/dist/types";
import { BaseService } from "./base.service";
import { _SERVICE as HistoryCanisterService, HistoryResponse } from "../declarations/history/history.did";
import { canisterId as historyCanisterId, createActor as createHistoryActor } from "../declarations/history";
import { canisterId as symptomCanisterId } from "../declarations/symptom";

export class HistoryService extends BaseService<HistoryCanisterService> {

    constructor() {
        super(historyCanisterId, createHistoryActor);
    }

    public async getHistoryById(id: string) {
        try {
            const response = await this.actor.getHistoryWithSymptoms(id, symptomCanisterId);
            console.log("History fetched:", response);
            return response;
        } catch (error) {
            console.error("Error fetching history by ID:", error);
            throw error;
        }
    }

    public async getMyHistories() {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }
            const response = await this.actor.getHistoryByUserId(principal);
            console.log("My histories fetched:", response);

        } catch (error) {
            console.error("Error fetching my histories:", error);
            throw error;
        }
    }


}