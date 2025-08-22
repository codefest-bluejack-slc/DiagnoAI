import Text "mo:base/Text";
import Principal "mo:base/Principal";
import SymptomType "../symptom";

module {
    public type Medicine = {
        brand_name: Text;
        generic_name: Text;
        manufacturer: Text;
        product_ndc: Text;
    };

    public type History = {
        id: Text;
        userId: Principal;
        username: Text;
        diagnosis: Text;
        medicine_response: Text;
        medicines: [Medicine];
    };

    public type HistoryResponse = {
        id: Text;
        userId: Principal;
        username: Text;
        diagnosis: Text;
        medicines: [Medicine];
        medicine_response: Text;
        symptoms: [SymptomType.Symptom];
    };

    public type HeaderField = (Text, Text);

    public type HttpRequest = {
        method : Text;
        url : Text;
        headers : [HeaderField];
        body : Blob;
        certificate_version : ?Nat16;
    };

    public type HttpResponse = {
        status_code : Nat16;
        headers : [HeaderField];
        body : Blob;
        streaming_strategy : ?Null;
        upgrade : ?Bool;
    };


    public type WelcomeResponse = {
        message : Text;
    };
}