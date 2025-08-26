import Principal "mo:base/Principal";
import Type "lib";

module {
    public type UserActor = actor {
        getUser : (Principal) -> async ?Type.User;
        addUser : (Type.User) -> async ?Type.User;
        updateUser : (Principal, Type.User) -> async Bool;
        deleteUser : (Principal) -> async Bool;
        getAllUsers : () -> async [(Principal, Type.User)];
    };
}