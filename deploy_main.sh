set -e

# Create identities
dfx identity new minter --disable-encryption || true
dfx identity new reciever --disable-encryption || true
dfx identity new testing --disable-encryption || true

dfx identity use ic_admin

MINTER=$(dfx --identity minter identity get-principal)
DEFAULT=$(dfx --identity ic_legatus identity get-principal)
TOKEN_SYMBOL=LEGA
TOKEN_NAME="LEGATUS"
TRANSFER_FEE=0
PRE_MINTED_TOKENS=100000000000000

dfx canister stop legatus_ledger --network ic || true
dfx canister delete legatus_ledger --network ic || true

dfx deploy legatus_ledger --network ic --argument "(variant {Init = 
record {
     token_symbol = \"${TOKEN_SYMBOL}\";
     token_name = \"${TOKEN_NAME}\";
     minting_account = record { owner = principal \"${MINTER}\" };
     transfer_fee = ${TRANSFER_FEE};
     metadata = vec {};
     initial_balances = vec { record { record { owner = principal \"${DEFAULT}\"; }; ${PRE_MINTED_TOKENS}; }; };
     archive_options = record {
         num_blocks_to_archive = 1000000000;
         trigger_threshold = 1000000000;
         controller_id = principal \"${DEFAULT}\";
     };
     feature_flags = opt record {icrc2 = true;};
 }
})"

LEDGER_ID=$(dfx canister id legatus_ledger --network ic)

dfx canister stop icrc1_index --network ic || true
dfx canister delete icrc1_index --network ic || true
dfx deploy icrc1_index --network ic --argument "
  record {
   ledger_id = (principal \"$LEDGER_ID\");
  }
"
# dfx canister stop legatus_airdrop || true
# dfx canister delete legatus_airdrop --yes --no-withdrawal || true
# dfx deploy legatus_airdrop
