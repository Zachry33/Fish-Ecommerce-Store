create table if not exists users (
    id int not null AUTO_INCREMENT,
    username varchar(255) not null,
    hash_password varchar(255) not null,
    email varchar(255) not null,
    primary key (id)
);