import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Type "type";


persistent actor User {
    let map = Map.new<Principal, Type.User>();

    public query func getUser(id: Principal) : async ?Type.User {
        Map.get<Principal, Type.User>(map, Map.phash, id);
    };

    public func addUser(id: Principal, value: Type.User) : async ?Type.User {
        ignore Map.put<Principal, Type.User>(map, Map.phash, id, value);
        Map.get<Principal, Type.User>(map, Map.phash, id);
    };

    

    public func updateUser(id: Principal, newValue: Type.User) : async Bool {
        switch (Map.get<Principal, Type.User>(map, Map.phash, id)) {
            case (?_) {
                ignore Map.put<Principal, Type.User>(map, Map.phash, id, newValue);
                true
            };
            case null { false };
        };
    };

    public func deleteUser(id: Principal) : async Bool {
        switch (Map.remove<Principal, Type.User>(map, Map.phash, id)) {
            case (?_) { true };
            case null { false };
        };
    };

    public query func getAllUsers() : async [(Principal, Type.User)] {
        Iter.toArray(Map.entries<Principal, Type.User>(map));
    };


}