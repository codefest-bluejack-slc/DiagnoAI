import { ActorSubclass } from "@ic-reactor/react/dist/types";
import { BaseService } from "./base.service";
import { _SERVICE as _USERSERVICE } from "../declarations/user/user.did";
import { canisterId as userCanisterId, createActor as createUserActor } from "../declarations/user";
import { aw } from "vitest/dist/chunks/reporters.D7Jzd9GS";

export class UserService extends BaseService<_USERSERVICE> {
    private II_URL = process.env.DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app'
    : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

    constructor() {
        super(userCanisterId, createUserActor);
    }


    public async login() {
        try {
            await BaseService.authClient.login({
                identityProvider: this.II_URL,
                onSuccess: async () => {
                    const identity = await BaseService.getCallerIdentity();
                    
                },
                onError: (error) => {
                    console.error("Login error:", error);
                    throw error;
                }
            })
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }       
    }


}