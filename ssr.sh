#!/bin/bash


cd client

echo "================================= Remove build dir client ==================================="
rm -rf build

echo "==================================== Start build client ====================================="
yarn build
cd ..

echo "======================================== Build done! ========================================="

echo "============================== Cp build client to server static =============================="

cd server

echo "================================== Remove build dir server ===================================="

rm -rf build

cd ..

cp -r client/build server/build

echo "=========================================== Done! ============================================"

echo "======================================= Starting SSR! ========================================"
cd server
npx kill-port 5000
yarn dev
