#!/bin/bash

echo "Cloning repository..."
git clone https://github.com/Sagarrajak01/smart-monitor.git

cd smart-monitor || exit

echo "Building C++ engine..."
cd engine || exit
make

echo "Setting up backend..."
cd ../bridge || exit

cat > .env <<EOL
PORT=3000
EOL

npm install

echo "Starting backend server..."
gnome-terminal -- bash -c "cd $(pwd) && node server.js; exec bash"

echo "Setting up frontend..."
cd ../dashboard || exit

cat > .env <<EOL
VITE_SOCKET_URL=http://localhost:3000
EOL

npm install

echo "Starting frontend..."
npm run dev