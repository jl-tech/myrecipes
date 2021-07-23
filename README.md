# capstoneproject-comp3900-w16a-goodname
![MyRecipes Logo](https://github.com/COMP3900-9900-Capstone-Project/capstoneproject-comp3900-w16a-goodname/blob/master/logo/WIP_logo_2.png?raw=true)
## Project documents drive:

https://drive.google.com/drive/folders/1yJ7aLntoO6hYm5q7MgF-A572aPRp40ZI?usp=sharing

## Setup
Instructions for Lubuntu VM.
### Database
1. Setup & install mySQL Server 8 with `sudo apt-get update && sudo apt-get install mysql-server`
2. Start mySQL server with `sudo service mysql start`
3. Run `sudo mysql` command in Terminal.
4. FOR CLEAN DATABASE: when in the `mysql` environment, run `source [path_to_project]/db/schema.sql`
5. FOR SAMPLE DATA:when in the `mysql` environment, run `source [path_to_project]/db/dump.sql`

Sample database login:

Username: `jonathan.liu2000@gmail.com`

Password: `myrecipes`

### Backend
1. Install pip3 with `sudo apt-get install python3-pip`
2. `cd` to project directory, then install requirements with `pip3 install -r requirements.txt`

### Dialogflow
1. Install Google Cloud SDK with `curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-347.0.0-linux-x86_64.tar.gz`
2. Extract the contents of the file to any location on your file system (preferably your Home directory)
3. Add Cloud SDK tools to `PATH`
4. Run the script (from the root of the folder you extracted in the last step) using this command: `./google-cloud-sdk/install.sh`
5. Run gcloud init to initialize the SDK:`./google-cloud-sdk/bin/gcloud init`
6. Install the Dialogflow client library with `pip install google-cloud-dialogflow`

### Frontend
1. Install nodejs with `sudo apt-get install nodejs`
2. Install npm with `sudo apt-get install npm`
3. `cd` to project directory, then `cd frontend-react` and install the required node modules with `npm install`


## Running
### Database
Simply make sure the mySQL service is running with `sudo service mysql status`. If it's not running `sudo server mysql start`

### Backend
`cd` into `backend` directory, then run `python3 server.py 5000`.

### Frontend
`cd` into `frontend-react` directory, then `npm start`.
