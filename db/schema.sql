--- MyRecipes mySQL Database schema
create or replace table Users (
    user_id serial,
    email   text not null,
    first_name text not null,
    last_name text not null,
    password text not null, -- TODO salt + hash instead of plaintext...
    profile_pic_path text not null, -- path in flask server to the profile pic file
    password_reset_code integer, -- password reset code if user requests password, NULL if not
                                -- TODO salt + hash instead of plaintext...
    primary key (serial)
);