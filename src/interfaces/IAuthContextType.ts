import { User } from "../declarations/user/user.did";
import { useMutation } from "../hooks/use-mutation";

export interface IAuthContextType {
    me: User | null;
    isAuthenticated: Boolean | null;
    setUser: (user: User) => void;
    login: ReturnType<typeof useMutation<void, User | null>>;
    getCurrentUser: ReturnType<typeof useMutation<void, User | null>>;
}