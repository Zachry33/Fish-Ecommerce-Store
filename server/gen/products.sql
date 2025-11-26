create table products (
    item_id int not null AUTO_INCREMENT,
    image_id varchar(255) not null,
    title varchar(255) not null,
    price float not null,
    description varchar(255),
    primary key (item_id)
);