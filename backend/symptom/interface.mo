import Type "lib";
import Bool "mo:base/Bool";

module {
    public type SymptomActor = actor {
        getSymptom(id: Text) : async ?Type.Symptom;
        getSymptomsByHistoryId(historyId: Text) : async [Type.Symptom];
        getAllSymptoms() : async [Type.Symptom];
        addSymptom(symptom: Type.Symptom) : async Text;
        updateSymptom(id: Text, symptom: Type.Symptom) : async ?Type.Symptom;
        deleteSymptom(id: Text) : async Bool;
    }
}