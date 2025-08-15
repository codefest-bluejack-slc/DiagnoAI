import Text "mo:base/Text";
import Principal "mo:base/Principal";
import SymptompType "../symptomp";

module {
    public type History = {
        id: Text;
        userId: Principal;
        title : Text;
        result: Text;
    };

    public type HistoryResponse = {
        id: Text;
        userId: Principal;
        title: Text;
        result: Text;
        symptomps: [SymptompType.Symptomp];
    };
}