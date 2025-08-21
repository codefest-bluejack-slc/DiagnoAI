import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
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
        switch (history) {
            case (#err _) {
                ignore await historyActor.addHistory({
                    id = value.historyId;
                    userId = userId;
                    description = "Health Assessment";
                    since = "2024-01-01";
                    status = "in-progress";
                    severity = value.severity;
                    diagnosis = null;
                });
            };
            case (#ok _) {};
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

    public query func getAllSymptoms() : async [(Text, Type.Symptom)] {
        Iter.toArray(Map.entries<Text, Type.Symptom>(map));
    };

    public query func getSymptomsByHistoryId(historyId: Text) : async [Type.Symptom] {
        // sama kea map di js, Text itu kea datatypenya (kea generic value?)
        let symptoms = Iter.toArray(Map.entries<Text, Type.Symptom>(map));

        // filter kea callback, filter based dari historyId
        let filteredSymptoms = Array.filter(symptoms, func ((_, symptom) : (Text, Type.Symptom)) : Bool {
            symptom.historyId == historyId
        });
        
        // return 
        Array.map(filteredSymptoms, func ((_, symptom) : (Text, Type.Symptom)) : Type.Symptom {
            symptom
        });
    };


}