#!/bin/bash

set -e

check_command() {
    command -v "$1" >/dev/null 2>&1 || {
        echo "$1 is not installed. Please install it first."
        exit 1
    }
}

echo "Checking dependencies..."

check_command git
check_command g++
check_command make
check_command node
check_command npm

echo "All dependencies found."

echo "Cloning repository..."
git clone -b feature/add-setup-script https://github.com/Sagarrajak01/smart-monitor.git

cd smart-monitor

echo "Building C++ engine..."
cd engine
make

echo "Setting up backend..."
cd ../bridge

cat > .env <<EOL
PORT=3000
EOL

npm install

echo "Starting backend..."
node server.js &

echo "Setting up frontend..."
cd ../dashboard

cat > .env <<EOL
VITE_SOCKET_URL=http://localhost:3000
EOL

npm install

echo "Starting frontend..."
npm run dev