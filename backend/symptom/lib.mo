import Text "mo:base/Text";

module {
    public type Symptom = {
        id: Text;
        historyId: Text;
        name: Text;
        severity: Text;
    };
}