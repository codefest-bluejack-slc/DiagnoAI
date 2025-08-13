import { ActorSubclass, AnonymousIdentity, HttpAgent, SignIdentity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";

export abstract class BaseService<T> {

    protected static agent: HttpAgent;
    protected static initialized = false;
    protected static authClient: AuthClient;
    protected actor!: ActorSubclass<T>;


    constructor(
        public readonly canisterId: string,
        protected readonly createActor: (canisterId: string, options?: any) => ActorSubclass<T>,
    ) {
        this.ensureInitialized().then(() => {
            this.actor = this.createActor(this.canisterId, {
                agent: BaseService.agent,
            });
            
        });
    }

    protected static async initializeAgent() {
        if (!this.initialized) {
            this.authClient = await AuthClient.create();
            const identity = this.authClient.getIdentity() || new AnonymousIdentity();
            this.agent = new HttpAgent({ identity });
            if (process.env.DFX_NETWORK !== "ic") {
                await this.agent.fetchRootKey();
            }
            this.initialized = true;
        }
    }


    public async ensureInitialized() {
        await BaseService.initializeAgent();
    }
    

    protected static async getCallerPrincipal () : Promise<Principal> { 
        return this.authClient.getIdentity().getPrincipal();
    }

    protected static async getCallerIdentity () : Promise<SignIdentity> { 
        const identity = this.authClient.getIdentity();
        if (identity instanceof AnonymousIdentity) {
            throw new Error("User is not authenticated");
        }

        if ("getPublicKey" in identity && "sign" in identity) {
            return identity as SignIdentity;
        } else {
            throw new Error("Invalid identity type: Expected SignIdentity");
        }
    }
}
