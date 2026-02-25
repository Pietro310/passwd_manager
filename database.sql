DROP TABLE IF EXISTS manager;

CREATE TABLE manager (
    id integer primary key autoincrement,
    email text,
    username text,
    passwd text not null, 
    note text
);
