import { ActorSubclass, Principal } from "@ic-reactor/react/dist/types";
import { BaseService } from "./base.service";
import { _SERVICE as HistoryCanisterService, HistoryResponse } from "../declarations/history/history.did";
import { canisterId as historyCanisterId, createActor as createHistoryActor } from "../declarations/history";

export class HistoryService extends BaseService<HistoryCanisterService> {

    constructor() {
        super(historyCanisterId, createHistoryActor);
    }

    public async getHistoryById(id: string) {
        try {
            const response = await this.actor.getHistory(id, process.env.SYMPTOMP_CANISTER_ID!);
            console.log("History fetched:", response);
            return response;
        } catch (error) {
            console.error("Error fetching history by ID:", error);
            throw error;
        }
    }


}