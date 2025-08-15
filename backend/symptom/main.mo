import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Type "lib";
import HistoryModule "../history/interface";



persistent actor Symptoms {
    let map = Map.new<Text, Type.Symptom>();

    public query func getSymptom(id: Text) : async ?Type.Symptom {
        Map.get<Text, Type.Symptom>(map, Map.thash, id);
    };

    public func addSymptom(userId: Principal, value: Type.Symptom, historyCanisterId : Text) : async ?Type.Symptom {
        let historyActor = actor (historyCanisterId) : HistoryModule.HistoryActor;
        let history = await historyActor.getHistory(value.historyId);
        if (history == null) {
            ignore await historyActor.addHistory(value.historyId, {
                id = value.historyId;
                userId = userId;
                title = "Your Symptoms";
                result = "";
            });
        };

        ignore Map.put<Text, Type.Symptom>(map, Map.thash, value.id, value);
        Map.get<Text, Type.Symptom>(map, Map.thash, value.id);
    };

    

    public func updateSymptoms(id: Text, newValue: Type.Symptom) : async Bool {
        switch (Map.get<Text, Type.Symptom>(map, Map.thash, id)) {
            case (?_) {
                ignore Map.put<Text, Type.Symptom>(map, Map.thash, id, newValue);
                true
            };
            case null { false };
        };
    };

    public func deleteSymptoms(id: Text) : async Bool {
        switch (Map.remove<Text, Type.Symptom>(map, Map.thash, id)) {
            case (?_) { true };
            case null { false };
        };
    };

    public query func getAllHistories() : async [(Text, Type.Symptom)] {
        Iter.toArray(Map.entries<Text, Type.Symptom>(map));
    };


}