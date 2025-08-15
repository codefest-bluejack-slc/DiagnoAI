import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Type "lib";
import SymptomModule "../symptom/interface";


persistent actor History{
    let map = Map.new<Text, Type.History>();

    public func getHistory(id: Text,symptomActorCanisterId: Text) : async Result.Result<Type.HistoryResponse, Text> {
        let histories = Map.get<Text, Type.History>(map, Map.thash, id);
        switch (histories) {
            case (?history) { 
                let symptomActor = actor (symptomActorCanisterId) : SymptomModule.SymptomActor;
                let symptomList = await symptomActor.getSymptomsByHistoryId(id);
                let response: Type.HistoryResponse = {
                    id = history.id;
                    userId = history.userId;
                    title = history.title;
                    result = history.result;
                    symptomps = symptomList;
                };
                #ok(response)
             };
            case null { #err("History not found") };
        };

    };

    public func addHistory(id: Text, value: Type.History) : async ?Type.History {
        ignore Map.put<Text, Type.History>(map, Map.thash, id, value);
        Map.get<Text, Type.History>(map, Map.thash, id);
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