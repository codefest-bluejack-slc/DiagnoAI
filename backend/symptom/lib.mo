import Text "mo:base/Text";
import Int "mo:base/Int";

module {
    public type Symptom = {
        id: Text;
        historyId: Text;
        description: Text;
        severity: Text;
        duration: Int;
    };
}