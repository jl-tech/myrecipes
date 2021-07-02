-- MyRecipes mySQL Database schema
create database if not exists myrecipes;

-- probs not secure...
create user if not exists 'myrecipes'@'localhost' identified by 'g3iCv7sr!';
grant all privileges on * . * to 'myrecipes'@'localhost';

use myrecipes;
drop table if exists Users;

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
    name text,
    type text,
    serving_size int,
    primary key(recipe_id)
);

create table RecipeIngredients(
    recipe_id integer references Recipes(recipe_id),
    ingredient_no integer,
    ingredient_name text,
    quantity text,
    primary key (recipe_id, ingredient_no)
);

create table RecipeSteps(
    recipe_id integer references Recipes(recipe_id),
    step_no integer,
    step_text text,
    primary key (recipe_id, step_no)
);

create table RecipePhotos(
    recipe_id integer references Recipes(recipe_id),
    photo_no integer,
    photo_path text,
    is_thumbnail boolean,
    primary key (recipe_id, photo_no)
);

-- temporary test account
insert ignore into Users(email, first_name, last_name, password_hash)
    values ('test@test.com', 'Test', 'Account', 'testing');