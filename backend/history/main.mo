import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Type "lib";
import SymptompModule "../symptomp/interface";


persistent actor History{
    let map = Map.new<Text, Type.History>();

    public func getHistory(id: Text,symptompActorCanisterId: Text) : async Result.Result<Type.HistoryResponse, Text> {
        let histories = Map.get<Text, Type.History>(map, Map.thash, id);
        switch (histories) {
            case (?history) { 
                let symptompActor = actor (symptompActorCanisterId) : SymptompModule.SymptompActor;
                let symptompList = await symptompActor.getSymptompsByHistoryId(id);
                let response: Type.HistoryResponse = {
                    id = history.id;
                    userId = history.userId;
                    title = history.title;
                    result = history.result;
                    symptomps = symptompList;
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