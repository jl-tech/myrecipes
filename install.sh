#!/bin/sh

printf "Welcome to MyRecipes install script\n"
printf "This will take up to 10 minutes. Press Ctrl+C in the next 5 seconds to cancel.\n"
sleep 5

printf "Beginning MyRecipes install...\n"
printf "[0/3] Running apt-get update...\n"
sleep 1
apt-get update
printf "[0/3] Installing database completed.\n\n\n"

printf "[1/3] Installing MyRecipes database...\n"
sleep 3
apt-get -y install mysql-server
service mysql start
mysql < ./db/schema.sql
mysql -p myrecipes < ./db/dump.sql
printf "[1/3] Installing database completed.\n\n\n"

printf "[2/3] Installing MyRecipes backend...\n"
sleep 3
apt-get -y install python3-pip
pip3 install -r ./requirements.txt
printf "[2/3] Installing backend completed.\n\n\n"

printf "[3/3] Installing MyRecipes frontend...\n"
sleep 3
apt-get -y install nodejs
apt-get -y install npm
npm install --prefix ./frontend_react ./frontend_react
printf "[3/3] Installing frontend completed.\n\n\n"

printf "Install complete!"




