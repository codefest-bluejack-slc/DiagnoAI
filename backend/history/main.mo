import Map "mo:motoko-hash-map/Map";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Type "lib";
import UserType "../user/lib";
import SymptomModule "../symptom/interface";
import UserModule "../user/interface";
import { JSON } "mo:serde";
import Debug "mo:base/Debug";


persistent actor History{
    let map = Map.new<Text, Type.History>();
    

    public func getHistory(id: Text) : async Result.Result<Type.History, Text> {
        let history = Map.get<Text, Type.History>(map, Map.thash, id);
        switch (history) {
            case (?history) { #ok(history) };
            case null { #err("History not found") };
        };
    };

    public func getHistoryWithSymptoms(id: Text, symptomActorCanisterId: Text) : async Result.Result<Type.HistoryResponse, Text> {
        let histories = Map.get<Text, Type.History>(map, Map.thash, id);
        switch (histories) {
            case (?history) { 
                let symptomActor = actor (symptomActorCanisterId) : SymptomModule.SymptomActor;
                let symptomList = await symptomActor.getSymptomsByHistoryId(id);
                let response: Type.HistoryResponse = {
                    id = history.id;
                    title = history.title;
                    userId = history.userId;
                    username = history.username;
                    diagnosis = history.diagnosis;
                    medicine_response = history.medicine_response;
                    medicines = history.medicines;
                    symptoms = symptomList;
                };
                #ok(response)
            };
            case null { #err("History not found") };
        };
    };

    public query func getHistoryByUserId(id: Principal) : async Result.Result<[Type.History], Text> {
        let histories = Iter.toArray(Map.entries<Text, Type.History>(map));
        let userHistories = Array.filter(histories, func ((_, history) : (Text, Type.History)) : Bool {
            history.userId == id
        });
        #ok(Array.map(userHistories, func ((_, history) : (Text, Type.History)) : Type.History {
            history
        }));
    };

    public func getHistoryByUsername(request: Type.HistoryRequest) : async Result.Result<Type.History, Text> {
        let userActor = actor (request.user_canister_id) : UserModule.UserActor;
        let users = await userActor.getAllUsers();
        let user = Array.find(users, func ((_, user) : (Principal, UserType.User)) : Bool {
            user.name == request.username
        });
        switch (user) {
            case (?user) {
                let histories = Iter.toArray(Map.entries<Text, Type.History>(map));
                let userHistories = Array.filter(histories, func ((_, history) : (Text, Type.History)) : Bool {
                    history.userId == user.0
                });
                if (userHistories.size() > 0) {
                    #ok(userHistories[0].1); // `.1` because it’s a (key, value) tuple
                } else {
                    #err("No history found for " # request.username);
                }
            };
            case null {
                #err("User not found");
            };
        };
    };

    public func addHistory(value: Type.History) : async ?Type.History {
        ignore Map.put<Text, Type.History>(map, Map.thash, value.id, value);
        Map.get<Text, Type.History>(map, Map.thash, value.id);
    };

    

    public func updateHistory(id: Text, newValue: Type.History) : async Bool {
        switch (Map.get<Text, Type.History>(map, Map.thash, id)) {
            case (?_) {
                ignore Map.put<Text, Type.History>(map, Map.thash, id, newValue);
                true
            };
            case null { false };
        };
    };

    public func deleteHistory(id: Text) : async Bool {
        switch (Map.remove<Text, Type.History>(map, Map.thash, id)) {
            case (?_) { true };
            case null { false };
        };
    };

    public query func getAllHistories() : async [(Text, Type.History)] {
        Iter.toArray(Map.entries<Text, Type.History>(map));
    };

    public shared query func welcome() : async Type.WelcomeResponse {
        {
        message = "Welcome to the Bitcoin Canister API";
        };
    };

    let WelcomeResponseKeys = ["message"];
    // let HistoryResponseKeys = ["id", "userId", "username", "diagnosis", "medicine_response", "medicines"];
    let HistoryResponseKeys = [ "diagnosis"];
    private func extractUsername(body : Blob) : Result.Result<Type.HistoryRequest, Text> {
        // Convert Blob to Text
        let jsonText = switch (Text.decodeUtf8(body)) {
            case null { return #err("Invalid UTF-8 encoding in request body") };
            case (?txt) { txt };
        };

        // Parse JSON using serde
        let #ok(blob) = JSON.fromText(jsonText, null) else {
            return #err("Invalid JSON format in request body");
        };

        let usernameField : ?Type.HistoryRequest = from_candid (blob);

        switch (usernameField) {
            case null return #err("Username field not found in JSON");
            case (?username) #ok(username);
        };
    };

    // Constructs a JSON HTTP response using serde
    private func makeJsonResponse(statusCode : Nat16, jsonText : Text) : Type.HttpResponse {
        {
        status_code = statusCode;
        headers = [("content-type", "application/json"), ("access-control-allow-origin", "*")];
        body = Text.encodeUtf8(jsonText);
        streaming_strategy = null;
        upgrade = ?true;
        };
    };

    // Constructs a standardized error response for serialization failures
    private func makeSerializationErrorResponse() : Type.HttpResponse {
        {
        status_code = 200;
        headers = [("content-type", "application/json")];
        body = Text.encodeUtf8("{\"error\": \"Failed to serialize response\"}");
        streaming_strategy = null;
        upgrade = null;
        };
    };

    // Handles simple HTTP routes (GET/OPTIONS and fallback)
    private func handleRoute(method : Text, url : Text, _body : Blob) : Type.HttpResponse {
        let normalizedUrl = Text.trimEnd(url, #text "/");

        switch (method, normalizedUrl) {
            case ("GET", "" or "/") {
                let welcomeMsg = {
                    message = "Welcome to the Dummy Bitcoin Canister API";
                };
                let blob = to_candid (welcomeMsg);
                let #ok(jsonText) = JSON.toText(blob, WelcomeResponseKeys, null) else return makeSerializationErrorResponse();
                makeJsonResponse(200, jsonText);
            };
            case ("OPTIONS", _) {
                {
                    status_code = 200;
                    headers = [("access-control-allow-origin", "*"), ("access-control-allow-methods", "GET, POST, OPTIONS"), ("access-control-allow-headers", "Content-Type")];
                    body = Text.encodeUtf8("");
                    streaming_strategy = null;
                    upgrade = null;
                };
            };
            case ("POST", "/get-history") {
                {
                    status_code = 200;
                    headers = [("content-type", "application/json")];
                    body = Text.encodeUtf8("");
                    streaming_strategy = null;
                    upgrade = ?true;
                };
            };
            case _ {
                {
                    status_code = 404;
                    headers = [("content-type", "application/json")];
                    body = Text.encodeUtf8("Not found: " # url);
                    streaming_strategy = null;
                    upgrade = null;
                };
            };
        };
    };

    // Handles POST routes that require async update (e.g., calling other functions)
    private func handleRouteUpdate(method : Text, url : Text, body : Blob) : async Type.HttpResponse {
        let normalizedUrl = Text.trimEnd(url, #text "/");

        switch (method, normalizedUrl) {
            case ("POST", "/get-history") {
                Debug.print("[INFO]: Started Get History");
                let usernameResult = extractUsername(body);
                let username = switch (usernameResult) {
                    case (#err(errorMessage)) {
                        return makeJsonResponse(400, "{\"error\": \"" # errorMessage # "\"}");
                    };
                    case (#ok(name)) { name };
                };
                Debug.print("[INFO]: Extracted username: " # username.username # " with user_canister_id: " # username.user_canister_id);

                let response : Result.Result<Type.History, Text> = await getHistoryByUsername(username);

                switch (response) {
                    case (#ok(history)) {
                        // Now `history` is your Type.History value
                        type ResultTotal = {
                            diagnosis : Text
                        };
                        let diag : ResultTotal = {
                            diagnosis = history.diagnosis;
                        };
                        Debug.print("[INFO]: Get History diagnosis: " # debug_show(diag.diagnosis));
                        let blob = to_candid(diag); // convert just the History
                        let #ok(jsonText) = JSON.toText(blob, HistoryResponseKeys, null)
                        else return makeSerializationErrorResponse();
                        Debug.print("[INFO]: Get History response: " # debug_show(jsonText));
                        makeJsonResponse(200, jsonText);
                    };
                    case (#err(msg)) {
                        // handle error
                        Debug.print("[ERROR]: " # msg);
                        Debug.print("Testing");
                        makeJsonResponse(200, "{\"error\": \"" # msg # "\"}");
                    };
                };
            };
            case ("OPTIONS", _) {
                {
                status_code = 200;
                headers = [("access-control-allow-origin", "*"), ("access-control-allow-methods", "GET, POST, OPTIONS"), ("access-control-allow-headers", "Content-Type")];
                body = Text.encodeUtf8("");
                streaming_strategy = null;
                upgrade = null;
                };
            };
            case _ {
                return handleRoute(method, url, body);
            };
        };
    };

    // HTTP query interface for GET/OPTIONS and static responses
    public query func http_request(req : Type.HttpRequest) : async Type.HttpResponse {
        return handleRoute(req.method, req.url, req.body);
    };

    // HTTP update interface for POST routes requiring async calls
    public func http_request_update(req : Type.HttpRequest) : async Type.HttpResponse {
        return await handleRouteUpdate(req.method, req.url, req.body);
    };

    


}