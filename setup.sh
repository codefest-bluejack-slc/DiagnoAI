#!/bin/bash

# Modify CANISTERS array to include the canisters you want to create
CANISTERS=("user" "symptom" "history")
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
done
dfx deploy
dfx canister create frontend
dfx deploy frontend