import Principal "mo:base/Principal";

actor {
  public query (message) func get_principal_client() : async Text {
    return "Principal: " # Principal.toText(message.caller) # "!";
  };
};
