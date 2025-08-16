import { ActorSubclass, Principal } from "@ic-reactor/react/dist/types";
import { BaseService } from "./base.service";
import { _SERVICE as UserCanisterService, User } from "../declarations/user/user.did";
import { canisterId as userCanisterId ,createActor as createUserActor } from "../declarations/user";
import { firstOrDefault } from "../utils/service-utils";

export class UserService extends BaseService<UserCanisterService> {
    private II_URL = process.env.DFX_NETWORK === 'ic'
    ? 'https://identity.ic0.app'
    : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

    constructor() {

        super(userCanisterId, createUserActor);
    }

    public async getUserByPrincipal(principal: Principal): Promise<User | null> {    
        try {
            const response = await this.actor.getUser(principal);
            return firstOrDefault(response);
        } catch (error) {
            console.error("Error fetching user by principal:", error);
            throw error;
        }
    }

    public async addUser(user: User): Promise<User | null> {
        console.log("Adding user:", user);
        try {
            const response = await this.actor.addUser(user);
            console.log("User added:", response);
            return firstOrDefault(response);
        } catch (error) {
            console.error("Error adding user:", error);
            throw error;
        }
    }


    public async login() : Promise<User | null> {
        return new Promise<User | null>(async (resolve, reject) => {
            try {
                await BaseService.authClient.login({
                    identityProvider: this.II_URL,
                    onSuccess: async () => {
                        const identity = await BaseService.getCallerIdentity();
                        const user : User = {
                            id: identity.getPrincipal(),
                            name: "",
                            email: "",
                            bio: "My Bio",
                            profilePicture: []
                        }
                        const response = await this.addUser(user)

                        resolve(response);
                    },
                    onError: (error) => {
                        console.error("Login error:", error);
                        reject(error);
                    }
                })
            } catch (error) {
                console.error("Login failed:", error);
                reject(error);
            }       
        })
    }

    public async updateUser(user: User): Promise<boolean> {
        try {
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }
            console.log("Updating user:", user);
            const response = await this.actor.updateUser(user.id,user);
            return response;
        }
        catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    public async me() : Promise<User | null> {
        try {
            console.log(BaseService.authClient)
            const principal = await BaseService.getCallerPrincipal();
            if (principal.isAnonymous()) {
                throw new Error("User is not authenticated");
            }
            return this.getUserByPrincipal(principal);
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
    }


}