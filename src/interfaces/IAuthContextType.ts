import { User } from "../declarations/user/user.did";
import { useMutation } from "../hooks/use-mutation";

export interface IAuthContextType {
    me: User | null;
    isAuthenticated: boolean | null;
    setUser: (user: User) => void;
    login: ReturnType<typeof useMutation<void, User | null>>;
    logout: ReturnType<typeof useMutation<void, void>>;
    getCurrentUser: ReturnType<typeof useMutation<void, User | null>>;
}