import Type "lib";
import Bool "mo:base/Bool";
import Result "mo:base/Result";


module {
    public type HistoryActor = actor {
        getHistory(id: Text) : async Result.Result<Type.History,Text>;

        getAllHistories() : async [Type.History];
        addHistory(value: Type.History) : async ?Type.History;
        updateHistory(id: Text, value: Type.History) : async ?Type.History;
        deleteHistory(id: Text) : async Bool;
    }
}