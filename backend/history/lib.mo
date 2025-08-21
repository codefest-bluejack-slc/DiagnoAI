import Text "mo:base/Text";
import Principal "mo:base/Principal";
import SymptomType "../symptom";

module {
    public type History = {
        id: Text;
        userId: Principal;
        description: Text;
        since: Text;
        status: Text;
        severity: Text;
        diagnosis: ?Text;
    };

    public type HistoryResponse = {
        id: Text;
        userId: Principal;
        description: Text;
        since: Text;
        status: Text;
        severity: Text;
        diagnosis: ?Text;
        symptoms: [SymptomType.Symptom];
    };
}