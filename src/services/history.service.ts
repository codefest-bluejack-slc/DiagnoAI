import { ActorSubclass, Principal } from "@ic-reactor/react/dist/types";
import { BaseService } from "./base.service";
import { _SERVICE as _HISTORYSERVICE, HistoryResponse } from "../declarations/history/history.did";
import { createActor as createHistoryActor } from "../declarations/history";
import { historyCanisterId, symptompCanisterId } from "../config/canister";

export class HistoryService extends BaseService<_HISTORYSERVICE> {

    constructor() {
        super(historyCanisterId, createHistoryActor);
    }

    public async getHistoryById(id: string) {
        try {
            const response = await this.actor.getHistory(id, symptompCanisterId);
            console.log("History fetched:", response);
            return response;
        } catch (error) {
            console.error("Error fetching history by ID:", error);
            throw error;
        }
    }


}