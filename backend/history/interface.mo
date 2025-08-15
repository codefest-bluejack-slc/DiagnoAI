import Type "lib";
import Bool "mo:base/Bool";

module {
    public type HistoryActor = actor {
        getHistory(id: Text) : async ?Type.History;
        getAllHistories() : async [Type.History];
        addHistory(id: Text, value: Type.History) : async ?Type.History;
        updateHistory(id: Text, value: Type.History) : async ?Type.History;
        deleteHistory(id: Text) : async Bool;
    }
}