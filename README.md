<img src="/logo/WIP_logo_2.png" height="150"/>

# MyRecipes
## Screenshots
### Home
<img src="/screenshots/home.png"/>

### Recipe
<img src="/screenshots/recipe.png"/>

### Profile
<img src="/screenshots/profile.png"/>

### Search
<img src="/screenshots/search.png"/>

### Newsfeed
<img src="/screenshots/news.png"/>

### Create recipe
<img src="/screenshots/create.png"/>

### Chatbot
<img src="/screenshots/chatbot.png"/>

## Setup
The instructions below are based on the instructions contained in Final Report 
Part 5.

Please use the Lubuntu VM image without any modifications.

### Automatic install process
Run the automatic install script with `sudo sh install.sh`
- You will need to enter `lubuntu` as the superuser password.
- This script can take approximately 10 minutes to run. 
- If you are prompted to enter a password, please enter `lubuntu`
- The script will inform you of progress after each step is completed.

### Manual install process
If, for some reason the automatic installation process fails to work or run, please install MyRecipes manually by running the following commands:

#### Database 
`sudo apt-get update`

`sudo apt-get -y install mysql-server`

`service mysql start`		

`mysql < ./db/schema.sql`

`mysql -p myrecipes < ./db/dump.sql`


#### Backend
`apt-get -y install python3-pip`

`pip3 install -r ./requirements.txt`

#### Frontend
`apt-get -y install nodejs`

`apt-get -y install npm`

`npm install --prefix ./frontend_react ./frontend_react`


## Running
Please follow these steps to run MyRecipes:
1.	Open two terminal windows. In both, `cd` to the project directory.
2.	In any terminal window, ensure the MySQL service is running with `sudo service mysql status`. If it is not running, run it with `sudo service mysql start` 
- ⓘ Once the service is running, the database is now operational.
3.	In the first terminal window, `cd backend`
4.	In the first terminal window, run the backend with `python3 server.py`
- ⓘ The backend is now operational in the first terminal window.
5.	In the second terminal window, `cd `frontend_react`
6.	In the second terminal window, run the frontend with `npm start`
- ⓘ The frontend is now operational in the second terminal window.

After step 6 your browser should have opened with MyRecipes. If not, open your browser and head to `localhost:3000`.


## If something goes wrong
If something goes wrong, please consult the Final Report Technical Manual section 5.
