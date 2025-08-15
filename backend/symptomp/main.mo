import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Type "lib";
import HistoryModule "../history/interface";



persistent actor Symptomps {
    let map = Map.new<Text, Type.Symptomp>();

    public query func getSymptomp(id: Text) : async ?Type.Symptomp {
        Map.get<Text, Type.Symptomp>(map, Map.thash, id);
    };

    public func addSymptomps(id: Text,userId: Principal, value: Type.Symptomp, historyCanisterId : Text) : async ?Type.Symptomp {
        let historyActor = actor (historyCanisterId) : HistoryModule.HistoryActor;
        let history = await historyActor.getHistory(value.historyId);
        if (history == null) {
            ignore await historyActor.addHistory(value.historyId, {
                id = value.historyId;
                userId = userId;
                title = "Your Symptomps";
                result = "";
            });
        };

        ignore Map.put<Text, Type.Symptomp>(map, Map.thash, id, value);
        Map.get<Text, Type.Symptomp>(map, Map.thash, id);
    };

    

    public func updateSymptomps(id: Text, newValue: Type.Symptomp) : async Bool {
        switch (Map.get<Text, Type.Symptomp>(map, Map.thash, id)) {
            case (?_) {
                ignore Map.put<Text, Type.Symptomp>(map, Map.thash, id, newValue);
                true
            };
            case null { false };
        };
    };

    public func deleteSymptomps(id: Text) : async Bool {
        switch (Map.remove<Text, Type.Symptomp>(map, Map.thash, id)) {
            case (?_) { true };
            case null { false };
        };
    };

    public query func getAllHistories() : async [(Text, Type.Symptomp)] {
        Iter.toArray(Map.entries<Text, Type.Symptomp>(map));
    };


}