##### \! cls clear screen

##### \l list all databases --> list all databases

SELECT dataname FROM pg_database; --> list all databases

##### CREATE DATABASE db_name; --> create database

##### DROP DATABASE db_name; --> drop database

##### \c db_name --> connect to database

CREATE TABLE person (
id INT,
name VARCHAR(100),
city VARCHAR(100),
);

\d table_name --> describe table
\dt --> list all tables

INSERT INTO person (id, name, city) VALUES (1, 'John', 'New York');

INSERT INTO person VALUES (2, 'John', 'New York');

SELECT \* FROM person;

SELECT name FROM person;
SELECT name,city FROM person;

UPDATE person SET city = 'New York' WHERE id = 1;

DELETE FROM person WHERE id = 1;

SELECT \* FROM person WHERE id = 1 AND name = 'John' AND city = 'New York';
SELECT \* FROM person WHERE id = 1 OR name = 'John' OR city = 'New York';

SELECT \* FROM person WHERE id IN (1,2,3);

SELECT \* FROM person WHERE id BETWEEN 1 AND 3;

SELECT DISTINCT name FROM person;

SELECT _ FROM person ORDER BY name ASC;
SELECT _ FROM person ORDER BY name DESC;

SELECT _ FROM person LIMIT 10;
SELECT _ FROM person LIMIT 10 OFFSET 5;

SELECT _ FROM person WHERE name LIKE 'J%';
SELECT _ FROM person WHERE name ILIKE 'J%';
