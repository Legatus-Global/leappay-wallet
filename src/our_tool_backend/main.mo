import Principal "mo:base/Principal";
import Array "mo:base/Array";
import List "mo:base/List";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Types "Types";

actor {
  type MetaDataWithBalance = {
    balance : Types.Balance;
    metadata : Types.MetaData;
    tokenCanisterId : Text;
  };

  // var tokenCanisterId : Text = "6rdgd-kyaaa-aaaaq-aaavq-cai";
  var tokenCanisterId : Text = "h5frd-xqaaa-aaaao-a2pva-cai";

  var tokenCanisterIdList : List.List<Text> = List.nil<Text>();
  tokenCanisterIdList := List.push("ryjl3-tyaaa-aaaaa-aaaba-cai", tokenCanisterIdList);
  tokenCanisterIdList := List.push("mxzaz-hqaaa-aaaar-qaada-cai", tokenCanisterIdList);
  // tokenCanisterIdList := List.push("gcncu-uiaaa-aaaao-a2prq-cai", tokenCanisterIdList);
  tokenCanisterIdList := List.push("h5frd-xqaaa-aaaao-a2pva-cai", tokenCanisterIdList);
  var couponHashMap = HashMap.HashMap<Text, Nat>(5, Text.equal, Text.hash);
  var redeemedCouponUser = HashMap.HashMap<Principal, Text>(5, Principal.equal, Principal.hash);
  stable var redeemedCouponUserArray : [(Principal, Text)] = [];

  // Save Coupon here
  couponHashMap.put("6de905da8b6372b9", 1000000000);

  // Get All tokens from our backend
  public func getAllTokens() : async [Text] {
    List.toArray(tokenCanisterIdList);
  };

  // Add new token into the backend
  // public func addToken(tokenCanisterId : Text) : async List.List<Text> {
  //   tokenCanisterIdList := List.push(tokenCanisterId, tokenCanisterIdList);
  //   tokenCanisterIdList;
  // };

  // Get all token with metadata and user balance
  public shared (msg) func getAllTokensWithData() : async [MetaDataWithBalance] {
    var combinedData : List.List<MetaDataWithBalance> = List.nil<MetaDataWithBalance>();
    for (tokenCanisterId in Iter.fromList(tokenCanisterIdList)) {
      let account : Types.Account = { owner = msg.caller; subaccount = null };
      let balance = await icrc1_balance_of(tokenCanisterId, account);
      let metadata = await icrc1_metadata(tokenCanisterId);
      let data = {
        balance = balance;
        tokenCanisterId = tokenCanisterId;
        metadata = metadata;
      };
      combinedData := List.push(data, combinedData);
    };
    List.toArray(combinedData);
  };

  // Check coupon
  public shared (msg) func isCouponValid(coupon : Text) : async Bool {
    var couponStatus : Bool = switch (couponHashMap.get(coupon)) {
      case null { false };
      case (?value) { true };
    };
    couponStatus;
  };

  // Claim coupon
  public shared (msg) func claimCoupon(coupon : Text) : async Text {
    var couponValue : Nat = switch (couponHashMap.get(coupon)) {
      case null { throw Error.reject("Coupon is invalid") };
      case (?value) { value };
    };
    var isCouponRedeemed : Bool = switch (redeemedCouponUser.get(msg.caller)) {
      case (null) { false };
      case (?result) { true };
    };
    if (isCouponRedeemed) {
      throw Error.reject("Coupon already redeemed");
    };
    let token_canister_actor = actor (tokenCanisterId) : Types.TokenInterface;
    let tokenFee : Nat = await token_canister_actor.icrc1_fee();
    let blob = Text.encodeUtf8("Claim");
    let transaction : Types.TransferArgs = {
      memo = ?blob;
      from_subaccount = null;
      to = { owner = msg.caller; subaccount = null };
      amount = couponValue;
      fee = ?tokenFee;
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
    };
    let res = await airDrop(tokenCanisterId, transaction);
    switch (res) {
      case (#Ok(blockIndex)) {
        redeemedCouponUser.put(msg.caller, coupon);
        return "Coupon claim successfully";
      };
      case (#Err(#InsufficientFunds { balance })) {
        throw Error.reject("Top me up! The balance is only " # debug_show balance);
      };
      case (#Err(other)) {
        throw Error.reject("Unexpected error: " # debug_show other);
      };
    };
    return "Coupon claim successfully";
  };

  // Token Intraction

  // Transfer the token to the other account
  private func airDrop(tokenCanisterId : Text, transaction : Types.TransferArgs) : async Types.TransferResult {
    let token_canister_actor = actor (tokenCanisterId) : Types.TokenInterface;
    await token_canister_actor.icrc1_transfer(transaction);
  };

  // Get token balance of user
  public func icrc1_balance_of(tokenCanisterId : Text, account : Types.Account) : async Types.Balance {
    let token_canister_actor = actor (tokenCanisterId) : Types.TokenInterface;
    await token_canister_actor.icrc1_balance_of(account);
  };
  // Get token metadata
  public func icrc1_metadata(tokenCanisterId : Text) : async Types.MetaData {
    let token_canister_actor = actor (tokenCanisterId) : Types.TokenInterface;
    await token_canister_actor.icrc1_metadata();
  };

  // Get all transactions of token
  public func get_transactions(tokenCanisterId : Text, tnxDetails : Types.GetTransactionsRequest) : async Types.TransactionRange {
    let token_canister_actor = actor (tokenCanisterId) : Types.ArchiveInterface;
    await token_canister_actor.get_transactions(tnxDetails);
  };

  // Get sepcifice transaction by tnx index
  public func get_transaction(tokenCanisterId : Text, tnxIndex : Types.TxIndex) : async ?Types.Transaction {
    let token_canister_actor = actor (tokenCanisterId) : Types.ArchiveInterface;
    await token_canister_actor.get_transaction(tnxIndex);
  };

  // Get total transaction of any user
  public func total_transactions(tokenCanisterId : Text) : async Nat {
    let token_canister_actor = actor (tokenCanisterId) : Types.ArchiveInterface;
    await token_canister_actor.total_transactions();
  };

  // Get the principal id of current user
  public shared (msg) func whoami() : async Text {
    Principal.toText(msg.caller);
  };


  public func getAllUser () : async [(Principal,Text)]{
    Iter.toArray(redeemedCouponUser.entries())
  };

  //preupgrade is function to transfer data of the hashmaps to the arrays
  system func preupgrade() {
    redeemedCouponUserArray := Iter.toArray(redeemedCouponUser.entries());

  };

  //postupgrade is function to transfer data of the array  to the hashmaps
  system func postupgrade() {
    redeemedCouponUser := HashMap.fromIter<Principal, Text>(redeemedCouponUserArray.vals(), 0, Principal.equal, Principal.hash);
    redeemedCouponUserArray := [];

  };
};
