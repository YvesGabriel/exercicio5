import Principal "mo:base/Principal";

actor {
  public shared(message) func get_principal_client() : async Text {
    return "Principal: " # Principal.toText(message.caller) # "!";
  };
  
};
