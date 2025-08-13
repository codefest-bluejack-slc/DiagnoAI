import Text "mo:base/Text";
module {
    public type User = {
        id: Principal;
        name: Text;
        email: Text;
    };
}