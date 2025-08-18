import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Type "lib";
import SymptomModule "../symptom/interface";


persistent actor History{
    let map = Map.new<Text, Type.History>();

    public func getHistory(id: Text) : async Result.Result<Type.History, Text> {
        let history = Map.get<Text, Type.History>(map, Map.thash, id);
        switch (history) {
            case (?history) { #ok(history) };
            case null { #err("History not found") };
        };
    };

    public func getHistoryWithSymptoms(id: Text, symptomActorCanisterId: Text) : async Result.Result<Type.HistoryResponse, Text> {
        let histories = Map.get<Text, Type.History>(map, Map.thash, id);
        switch (histories) {
            case (?history) { 
                let symptomActor = actor (symptomActorCanisterId) : SymptomModule.SymptomActor;
                let symptomList = await symptomActor.getSymptomsByHistoryId(id);
                let response: Type.HistoryResponse = {
                    id = history.id;
                    userId = history.userId;
                    description = history.description;
                    since = history.since;
                    status = history.status;
                    severity = history.severity;
                    diagnosis = history.diagnosis;
                    symptoms = symptomList;
                };
                #ok(response)
             };
            case null { #err("History not found") };
        };
    };

    public query func getHistoryByUserId(id: Principal) : async Result.Result<[Type.History], Text> {
        let histories = Iter.toArray(Map.entries<Text, Type.History>(map));
        let userHistories = Array.filter(histories, func ((_, history) : (Text, Type.History)) : Bool {
            history.userId == id
        });
        #ok(Array.map(userHistories, func ((_, history) : (Text, Type.History)) : Type.History {
            history
        }));
    };

    public func addHistory(value: Type.History) : async ?Type.History {
        ignore Map.put<Text, Type.History>(map, Map.thash, value.id, value);
        Map.get<Text, Type.History>(map, Map.thash, value.id);
    };

    

    public func updateHistory(id: Text, newValue: Type.History) : async Bool {
        switch (Map.get<Text, Type.History>(map, Map.thash, id)) {
            case (?_) {
                ignore Map.put<Text, Type.History>(map, Map.thash, id, newValue);
                true
            };
            case null { false };
        };
    };

    public func deleteHistory(id: Text) : async Bool {
        switch (Map.remove<Text, Type.History>(map, Map.thash, id)) {
            case (?_) { true };
            case null { false };
        };
    };

    public query func getAllHistories() : async [(Text, Type.History)] {
        Iter.toArray(Map.entries<Text, Type.History>(map));
    };


}