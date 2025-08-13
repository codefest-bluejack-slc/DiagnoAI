import Nat "mo:base/Nat";
import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";


persistent actor User {
    let map = Map.new<Principal, Nat>();

    public func addUser(id: Principal, value: Nat) : async () {
        ignore Map.put<Principal, Nat>(map, Map.phash, id, value);
    };

    public query func getUser(id: Principal) : async ?Nat {
        Map.get<Principal, Nat>(map, Map.phash, id);
    };

    public func updateUser(id: Principal, newValue: Nat) : async Bool {
        switch (Map.get<Principal, Nat>(map, Map.phash, id)) {
            case (?_) {
                ignore Map.put<Principal, Nat>(map, Map.phash, id, newValue);
                true
            };
            case null { false };
        };
    };

    public func deleteUser(id: Principal) : async Bool {
        switch (Map.remove<Principal, Nat>(map, Map.phash, id)) {
            case (?_) { true };
            case null { false };
        };
    };

    public query func getAllUsers() : async [(Principal, Nat)] {
        Iter.toArray(Map.entries<Principal, Nat>(map));
    };


}