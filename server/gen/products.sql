create table if not exists products (
    item_id int not null,
    image_id varchar(255) not null,
    title varchar(255) not null,
    description varchar(255),
    primary key (item_id)
);