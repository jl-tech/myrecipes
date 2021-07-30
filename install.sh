#!/bin/sh

echo "Welcome to MyRecipes install script"
echo "This will install MyRecipes onto this system. Press Ctrl+C in the next 5 seconds to cancel."
sleep 5

echo "Beginning MyRecipes install..."
echo "[0/4] Running apt-get update..."
sleep 1
apt-get update

echo "[1/4] Installing MyRecipes database..."
sleep 1
apt-get -y install mysql-server
service mysql start
mysql < ./db/schema.sql
mysql < ./db/dump.sql
echo "[1/4] Installing database completed."

echo "[2/4] Installing MyRecipes backend..."
sleep 1
apt-get -y install python3-pip
pip3 install -r ./backend/requirements.txt
echo "[2/4] Installing backend completed."

echo "[3/4] Installing MyRecipes frontend..."
sleep 1
apt-get -y install nodejs
apt-get -y install npm
pip3 install -r ./backend/requirements.txt
npm --prefix ./frontend_react ./frontend_react
echo "[3/4] Installing frontend completed."

echo "[4/4] Installing MyRecipes Dialogflow..."
sleep 1
curl -O "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-347.0.0-linux-x86_64.tar.gz"
tar -xf google-cloud-sdk-347.0.0-linux-x86_64.tar.gz -C .
sh ./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/gcloud init
echo "[4/4] Installing MyRecipes Dialogflow completed."

echo "Install complete! Restarting shell in 5 seconds (this is necessary to complete the install)"
sleep 5
exec "$SHELL"




