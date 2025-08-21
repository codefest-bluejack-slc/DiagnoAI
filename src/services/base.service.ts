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
            const agentOptions: any = {
                agent: BaseService.agent,
            };
            
            if (process.env.DFX_NETWORK !== "ic") {
                agentOptions.verifyQuerySignatures = false;
            }
            
            this.actor = this.createActor(this.canisterId, agentOptions);
        });
    }

    protected static async initializeAgent() {
        if (!this.initialized) {
            this.authClient = await AuthClient.create();
            await this.updateAgentIdentity();
            this.initialized = true;
        }
    }

    protected static async updateAgentIdentity() {
        const identity = this.authClient.getIdentity() || new AnonymousIdentity();
        
        const agentOptions: any = {
            identity,
            host: process.env.DFX_NETWORK === "ic" 
                ? "https://ic0.app" 
                : "http://127.0.0.1:4943"
        };
        
        if (process.env.DFX_NETWORK !== "ic") {
            agentOptions.verifyQuerySignatures = false;
        }
        
        this.agent = new HttpAgent(agentOptions);
        
        if (process.env.DFX_NETWORK !== "ic") {
            try {
                await this.agent.fetchRootKey();
            } catch (error) {
                console.warn("Failed to fetch root key, continuing with insecure mode:", error);
            }
        }
    }

    public async ensureInitialized() {
        await BaseService.initializeAgent();
    }

    public static async refreshAgent() {
        if (this.initialized && this.authClient) {
            try {
                await this.updateAgentIdentity();
            } catch (error) {
                console.warn("Failed to refresh agent, reinitializing:", error);
                this.initialized = false;
                await this.initializeAgent();
            }
        }
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

    public static async isAuthenticated(): Promise<boolean> {
        if (!this.initialized || !this.authClient) {
            return false;
        }
        const identity = this.authClient.getIdentity();
        return !(identity instanceof AnonymousIdentity);
    }
}
