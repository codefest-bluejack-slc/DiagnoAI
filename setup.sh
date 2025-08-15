
CANISTERS=("backend" "user")
dfx stop
dfx identity use default
dfx start --clean --background
npm i
for c in "${CANISTERS[@]}"; do
    echo "Creating canister: $c"
    dfx canister create "$c"
    echo "Generating canister: $c"
    dfx generate "$c"
    echo "Deploying canister: $c"
    dfx deploy "$c"
done
dfx canister create frontend
dfx deploy frontend
npm start