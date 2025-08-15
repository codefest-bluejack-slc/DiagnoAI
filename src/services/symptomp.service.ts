import { ActorSubclass, Principal } from "@ic-reactor/react/dist/types";
import { BaseService } from "./base.service";
import { _SERVICE as _SYMPTOMPSERVICE } from "../declarations/symptomp/symptomp.did";
import { createActor as createSymptompActor } from "../declarations/symptomp";
import { symptompCanisterId } from "../config/canister";

export class SymptompService extends BaseService<_SYMPTOMPSERVICE> {

    constructor() {
        super(symptompCanisterId, createSymptompActor);
    }


}