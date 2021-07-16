-- MyRecipes mySQL Database schema
create database if not exists myrecipes;

-- probs not secure...
create user if not exists 'myrecipes'@'localhost' identified by 'g3iCv7sr!';
grant all privileges on * . * to 'myrecipes'@'localhost';

use myrecipes;
drop table if exists Users;
drop table if exists Recipes;
drop table if exists RecipeIngredients;
drop table if exists RecipeSteps;
drop table if exists RecipePhotos;
drop table if exists SearchHistory;

create table Users (
    user_id serial,
    email   text not null,
    first_name text not null,
    last_name text not null,
    password_hash text not null, -- Use bcrypt at backend layer and store the value here
    profile_pic_path text, -- path in flask backend to the profile pic file, NULL if no pic
    password_reset_code_hash integer, -- password reset code if user requests password, NULL if not
    email_verified boolean,
    primary key (user_id)
);

create table Recipes(
    recipe_id serial,
    created_by_user_id integer references Users(user_id),
    creation_time timestamp,
    edit_time timestamp,
    time_to_cook int,
    name text,
    type text,
    serving_size int,
    description text,
    primary key(recipe_id),
    fulltext(name)
);

create table RecipeIngredients(
    recipe_id integer references Recipes(recipe_id),
    ingredient_no integer,
    ingredient_name text,
    quantity float,
    unit text,
    primary key (recipe_id, ingredient_no),
    fulltext(ingredient_name)
);

create table RecipeSteps(
    recipe_id integer references Recipes(recipe_id),
    step_no integer,
    step_text text,
    step_photo_path text,
    primary key (recipe_id, step_no),
    fulltext(step_text)
);

create table RecipePhotos(
    recipe_id integer references Recipes(recipe_id),
    photo_no integer, -- photo no 0 is thumbnail
    photo_path text,
    photo_name text,
    primary key (recipe_id, photo_no)
);

create table SearchHistory(
    user_id integer references Users(user_id),
    time timestamp,
    search_term text,
    primary key (user_id, time)
);

create table SubscribedTo(
    user_id integer references Users(user_id),
    is_subscribed_to integer references Users(user_id),
    primary key (user_id, is_subscribed_to)
);

create table Comments(
    recipe_id integer references Recipes(recipe_id),
    comment_no integer, -- unique number for this recipe
    time_created timestamp,
    time_edited timestamp,
    by_user_id integer references Users(user_id),
    comment_text text,
    primary key (recipe_id, comment_no)
);

create table Likes(
    recipe_id integer references Recipes(recipe_id),
    liked_by_user_id integer references Users(user_id),
    primary key (recipe_id, liked_by_user_id)
);

-- temporary test account
insert ignore into Users(email, first_name, last_name, password_hash)
    values ('test@test.com', 'Test', 'Account', 'testing');