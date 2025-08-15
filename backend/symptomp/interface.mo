import Type "lib";
import Bool "mo:base/Bool";

module {
    public type SymptompActor = actor {
        getSymptomp(id: Text) : async ?Type.Symptomp;
        getSymptompsByHistoryId(historyId: Text) : async [Type.Symptomp];
        getAllSymptomps() : async [Type.Symptomp];
        addSymptomp(symptomp: Type.Symptomp) : async Text;
        updateSymptomp(id: Text, symptomp: Type.Symptomp) : async ?Type.Symptomp;
        deleteSymptomp(id: Text) : async Bool;
    }
}