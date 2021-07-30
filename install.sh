#!/bin/sh

printf "Welcome to MyRecipes install script\n"
printf "This will take up to 10 minutes. Press Ctrl+C in the next 5 seconds to cancel.\n"
sleep 5

printf "Beginning MyRecipes install..."
printf "[0/4] Running apt-get update..."
sleep 1
apt-get update
printf "[0/4] Installing database completed.\n\n\n"

printf "[1/4] Installing MyRecipes database...\n"
sleep 3
apt-get -y install mysql-server
service mysql start
mysql < ./db/schema.sql
mysql < ./db/dump.sql
printf "[1/4] Installing database completed.\n\n\n"

printf "[2/4] Installing MyRecipes backend...\n"
sleep 3
apt-get -y install python3-pip
pip3 install -r ./backend/requirements.txt
printf "[2/4] Installing backend completed.\n\n\n"

printf "[3/4] Installing MyRecipes frontend...\n"
sleep 3
apt-get -y install nodejs
apt-get -y install npm
pip3 install -r ./requirements.txt
npm --prefix ./frontend_react ./frontend_react
printf "[3/4] Installing frontend completed.\n\n\n"

printf "[4/4] Installing MyRecipes Dialogflow...\n"
sleep 3
apt-get install curl
curl -O "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-347.0.0-linux-x86_64.tar.gz"
tar -xf google-cloud-sdk-347.0.0-linux-x86_64.tar.gz -C .
read -p "MANUAL INTERVENTION REQUIRED: Your browser will open. You must enter in the username and password specified in the install documentation manually. Then select MyRecipes. Press ENTER if you understand."
sh ./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/gcloud init
printf "[4/4] Installing MyRecipes Dialogflow completed.\n\n\n"

printf "Install complete! Restarting shell in 5 seconds (this is necessary to complete the install)\n"
sleep 5
exec "$SHELL"




