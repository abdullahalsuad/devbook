# SQL Command Cheatsheet

A comprehensive, easy-to-understand guide to SQL commands with practical examples, use cases, and explanations.

SQL (Structured Query Language) is a programming language used to interact with relational databases and perform CRUD operations (Create, Read, Update, Delete).

---

## Table of Contents

1. [Database Basics](#1-database-basics)
2. [Database Operations](#2-database-operations)
3. [Table Operations](#3-table-operations)
4. [SQL Datatypes](#4-sql-datatypes)
5. [Constraints](#5-constraints)
6. [Keys](#6-keys)
7. [SELECT Queries](#7-select-queries)
8. [WHERE Clause & Operators](#8-where-clause--operators)
9. [Aggregate Functions](#9-aggregate-functions)
10. [GROUP BY & HAVING](#10-group-by--having)
11. [UPDATE & DELETE](#11-update--delete)
12. [ALTER Table](#12-alter-table)
13. [Joins](#13-joins)
14. [UNION](#14-union)
15. [Sub Queries](#15-sub-queries)
16. [Views](#16-views)

---

## 1. Database Basics

### What is a Database?

A database is a collection of data in a format that can be easily accessed digitally.

### What is DBMS?

A Database Management System (DBMS) is software used to manage databases.

### Types of Databases

- **Relational:** Data stored in tables (uses SQL)
- **Non-relational (NoSQL):** Data not stored in tables

### Database Structure

```
Database
├── Table 1 (Data)
├── Table 2 (Data)
└── Table 3 (Data)
```

### What is a Table?

A table is a collection of related data organized in rows and columns.

**Example:**

```
Student Table:
+---------+-----------+-----+------+
| Roll_No | Name      | Age | City |
+---------+-----------+-----+------+
| 101     | John      | 20  | NYC  |
| 102     | Sarah     | 21  | LA   |
+---------+-----------+-----+------+
```

---

## 2. Database Operations

### 2.1 Create Database

```sql
CREATE DATABASE db_name;
```

**What it does:** Creates a new database.

**When to use:** When starting a new project or application.

**Why use it:** To organize your data in a separate database.

**Example:**

```sql
CREATE DATABASE school_db;
CREATE DATABASE IF NOT EXISTS school_db;  -- Only create if doesn't exist
```

---

### 2.2 Drop Database

```sql
DROP DATABASE db_name;
```

**What it does:** Deletes an entire database and all its data.

**When to use:** When you no longer need a database.

**Why use it:** To remove outdated or test databases.

**Example:**

```sql
DROP DATABASE old_db;
DROP DATABASE IF EXISTS old_db;  -- Only drop if exists
```

---

### 2.3 Show Databases

```sql
SHOW DATABASES;
```

**What it does:** Lists all databases on the server.

**When to use:** To see what databases are available.

**Why use it:** To verify database creation or check existing databases.

---

### 2.4 Use Database

```sql
USE db_name;
```

**What it does:** Selects a database to work with.

**When to use:** Before creating tables or running queries.

**Why use it:** To specify which database your commands should affect.

**Example:**

```sql
USE school_db;
```

---

### 2.5 Show Tables

```sql
SHOW TABLES;
```

**What it does:** Lists all tables in the current database.

**When to use:** To see what tables exist in your database.

**Why use it:** To verify table creation or explore database structure.

---

## 3. Table Operations

### 3.1 Create Table

```sql
CREATE TABLE table_name (
    column_name1 datatype constraint,
    column_name2 datatype constraint,
    column_name3 datatype constraint
);
```

**What it does:** Creates a new table with specified columns.

**When to use:** When you need to store structured data.

**Why use it:** To define the structure of your data.

**Example:**

```sql
CREATE TABLE students (
    roll_no INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT,
    city VARCHAR(50)
);
```

---

### 3.2 Insert Data

```sql
INSERT INTO table_name (col1, col2, col3)
VALUES
    (val1, val2, val3),
    (val1, val2, val3);
```

**What it does:** Adds new rows of data to a table.

**When to use:** When adding new records to your database.

**Why use it:** To populate tables with data.

**Example:**

```sql
INSERT INTO students (roll_no, name, age, city)
VALUES
    (101, 'John Smith', 20, 'New York'),
    (102, 'Sarah Jones', 21, 'Los Angeles'),
    (103, 'Mike Brown', 19, 'Chicago');
```

---

### 3.3 Select Data

```sql
SELECT * FROM table_name;
```

**What it does:** Retrieves data from a table.

**When to use:** When you want to view or work with data.

**Why use it:** To read and display information from the database.

**Example:**

```sql
SELECT * FROM students;              -- Get all columns
SELECT name, city FROM students;     -- Get specific columns
```

---

### 3.4 Drop Table

```sql
DROP TABLE table_name;
```

**What it does:** Deletes a table and all its data permanently.

**When to use:** When you no longer need a table.

**Why use it:** To remove unnecessary tables.

**Example:**

```sql
DROP TABLE old_students;
```

---

### 3.5 Truncate Table

```sql
TRUNCATE TABLE table_name;
```

**What it does:** Deletes all data from a table but keeps the table structure.

**When to use:** When you want to empty a table quickly.

**Why use it:** Faster than DELETE for removing all rows.

**Example:**

```sql
TRUNCATE TABLE temp_data;
```

---

## 4. SQL Datatypes

Datatypes define what type of values can be stored in a column.

### Numeric Types

```sql
TINYINT         -- -128 to 127
TINYINT UNSIGNED -- 0 to 255
INT             -- -2,147,483,648 to 2,147,483,647
BIGINT          -- Very large integers
DECIMAL(p,s)    -- Fixed-point numbers (p=precision, s=scale)
FLOAT           -- Floating-point numbers
```

### String Types

```sql
CHAR(size)      -- Fixed length string (0-255)
VARCHAR(size)   -- Variable length string (0-65535)
TEXT            -- Large text data
```

### Date & Time Types

```sql
DATE            -- YYYY-MM-DD
TIME            -- HH:MM:SS
DATETIME        -- YYYY-MM-DD HH:MM:SS
YEAR            -- Year value
```

**Example:**

```sql
CREATE TABLE employees (
    id INT,
    name VARCHAR(100),
    salary DECIMAL(10,2),
    hire_date DATE,
    is_active BOOLEAN
);
```

---

## 5. Constraints

SQL constraints specify rules for data in a table.

### 5.1 NOT NULL

**What it does:** Ensures a column cannot have NULL values.

**Example:**

```sql
CREATE TABLE users (
    id INT NOT NULL,
    username VARCHAR(50) NOT NULL
);
```

---

### 5.2 UNIQUE

**What it does:** Ensures all values in a column are different.

**Example:**

```sql
CREATE TABLE users (
    email VARCHAR(100) UNIQUE
);
```

---

### 5.3 PRIMARY KEY

**What it does:** Makes a column unique and not null (identifies each row uniquely).

**When to use:** Every table should have a primary key.

**Why use it:** To uniquely identify each record.

**Example:**

```sql
CREATE TABLE students (
    roll_no INT PRIMARY KEY,
    name VARCHAR(50)
);
```

---

### 5.4 FOREIGN KEY

**What it does:** Links two tables together, references PRIMARY KEY in another table.

**When to use:** When creating relationships between tables.

**Why use it:** To maintain data integrity across tables.

**Example:**

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

---

### 5.5 DEFAULT

**What it does:** Sets a default value for a column.

**Example:**

```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    stock INT DEFAULT 0
);
```

---

### 5.6 CHECK

**What it does:** Limits the values allowed in a column.

**Example:**

```sql
CREATE TABLE students (
    id INT PRIMARY KEY,
    age INT CHECK (age >= 18),
    grade CHAR(1) CHECK (grade IN ('A', 'B', 'C', 'D', 'F'))
);
```

---

## 6. Keys

### Primary Key

- Uniquely identifies each row in a table
- Only one primary key per table
- Cannot be NULL
- Must contain unique values

**Example:**

```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50)
);
```

---

### Foreign Key

- References PRIMARY KEY in another table
- Creates relationship between tables
- Can have duplicate and NULL values
- Can have multiple foreign keys in a table

**Example:**

```sql
-- Parent table
CREATE TABLE cities (
    city_id INT PRIMARY KEY,
    city_name VARCHAR(50)
);

-- Child table
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50),
    city_id INT,
    FOREIGN KEY (city_id) REFERENCES cities(city_id)
);
```

---

### Cascading for Foreign Keys

**ON DELETE CASCADE:** When a row in parent table is deleted, automatically delete related rows in child table.

**ON UPDATE CASCADE:** When a value in parent table is updated, automatically update related rows in child table.

**Example:**

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

---

## 7. SELECT Queries

### 7.1 Basic SELECT

```sql
SELECT col1, col2 FROM table_name;
SELECT * FROM table_name;  -- Select all columns
```

**What it does:** Retrieves specified columns from a table.

**Example:**

```sql
SELECT name, age FROM students;
SELECT * FROM students;
```

---

### 7.2 LIMIT Clause

```sql
SELECT * FROM table_name LIMIT number;
```

**What it does:** Limits the number of rows returned.

**When to use:** When you only need a specific number of results.

**Why use it:** To improve performance and get sample data.

**Example:**

```sql
SELECT * FROM students LIMIT 5;      -- Get first 5 students
SELECT * FROM students LIMIT 10, 5;  -- Skip 10, get next 5
```

---

### 7.3 ORDER BY Clause

```sql
SELECT * FROM table_name ORDER BY col_name ASC;   -- Ascending
SELECT * FROM table_name ORDER BY col_name DESC;  -- Descending
```

**What it does:** Sorts results in ascending or descending order.

**When to use:** When you need sorted results.

**Why use it:** To organize data in a meaningful way.

**Example:**

```sql
SELECT * FROM students ORDER BY age ASC;
SELECT * FROM students ORDER BY marks DESC;
SELECT * FROM students ORDER BY city ASC, name ASC;  -- Multiple columns
```

---

## 8. WHERE Clause & Operators

### 8.1 WHERE Clause

```sql
SELECT * FROM table_name WHERE condition;
```

**What it does:** Filters records based on conditions.

**When to use:** When you need specific records.

**Why use it:** To retrieve only relevant data.

**Example:**

```sql
SELECT * FROM students WHERE age > 18;
SELECT * FROM students WHERE city = 'New York';
```

---

### 8.2 Arithmetic Operators

```sql
+  -- Addition
-  -- Subtraction
*  -- Multiplication
/  -- Division
%  -- Modulus
```

**Example:**

```sql
SELECT name, marks + 10 AS bonus_marks FROM students;
SELECT * FROM students WHERE marks % 2 = 0;  -- Even marks
```

---

### 8.3 Comparison Operators

```sql
=   -- Equal to
!=  -- Not equal to
>   -- Greater than
>=  -- Greater than or equal to
<   -- Less than
<=  -- Less than or equal to
```

**Example:**

```sql
SELECT * FROM students WHERE age >= 18;
SELECT * FROM students WHERE city != 'Boston';
```

---

### 8.4 Logical Operators

**AND:** Both conditions must be true

```sql
SELECT * FROM students WHERE age > 18 AND city = 'New York';
```

**OR:** At least one condition must be true

```sql
SELECT * FROM students WHERE city = 'New York' OR city = 'LA';
```

**NOT:** Negates a condition

```sql
SELECT * FROM students WHERE NOT city = 'Boston';
```

**BETWEEN:** Selects values within a range

```sql
SELECT * FROM students WHERE age BETWEEN 18 AND 25;
SELECT * FROM students WHERE marks BETWEEN 80 AND 100;
```

**IN:** Matches any value in a list

```sql
SELECT * FROM students WHERE city IN ('New York', 'LA', 'Chicago');
```

**LIKE:** Pattern matching

```sql
SELECT * FROM students WHERE name LIKE 'J%';      -- Starts with J
SELECT * FROM students WHERE name LIKE '%son';    -- Ends with son
SELECT * FROM students WHERE name LIKE '%mi%';    -- Contains mi
```

---

## 9. Aggregate Functions

Aggregate functions perform calculations on a set of values and return a single value.

### 9.1 COUNT()

**What it does:** Returns the number of rows.

**Example:**

```sql
SELECT COUNT(*) FROM students;
SELECT COUNT(DISTINCT city) FROM students;  -- Count unique cities
```

---

### 9.2 MAX()

**What it does:** Returns the maximum value.

**Example:**

```sql
SELECT MAX(marks) FROM students;
SELECT MAX(salary) FROM employees;
```

---

### 9.3 MIN()

**What it does:** Returns the minimum value.

**Example:**

```sql
SELECT MIN(marks) FROM students;
SELECT MIN(age) FROM students;
```

---

### 9.4 SUM()

**What it does:** Returns the sum of all values.

**Example:**

```sql
SELECT SUM(marks) FROM students;
SELECT SUM(salary) FROM employees;
```

---

### 9.5 AVG()

**What it does:** Returns the average value.

**Example:**

```sql
SELECT AVG(marks) FROM students;
SELECT AVG(salary) FROM employees WHERE department = 'IT';
```

---

## 10. GROUP BY & HAVING

### 10.1 GROUP BY Clause

```sql
SELECT column, COUNT(*)
FROM table_name
GROUP BY column;
```

**What it does:** Groups rows with the same values into summary rows.

**When to use:** When you want to aggregate data by categories.

**Why use it:** To get statistics for each group.

**Example:**

```sql
-- Count students in each city
SELECT city, COUNT(*) AS student_count
FROM students
GROUP BY city;

-- Average marks by city
SELECT city, AVG(marks) AS avg_marks
FROM students
GROUP BY city;
```

---

### 10.2 HAVING Clause

```sql
SELECT column, COUNT(*)
FROM table_name
GROUP BY column
HAVING condition;
```

**What it does:** Applies conditions on grouped data (like WHERE but for groups).

**When to use:** When you need to filter groups based on aggregate values.

**Why use it:** WHERE filters rows before grouping, HAVING filters after grouping.

**Example:**

```sql
-- Cities with more than 5 students
SELECT city, COUNT(*) AS student_count
FROM students
GROUP BY city
HAVING COUNT(*) > 5;

-- Cities where average marks > 75
SELECT city, AVG(marks) AS avg_marks
FROM students
GROUP BY city
HAVING AVG(marks) > 75;
```

---

### General Query Order

```sql
SELECT column(s)
FROM table_name
WHERE condition           -- Filter rows
GROUP BY column(s)        -- Group data
HAVING condition          -- Filter groups
ORDER BY column(s) ASC;   -- Sort results
```

---

## 11. UPDATE & DELETE

### 11.1 UPDATE Command

```sql
UPDATE table_name
SET col1 = val1, col2 = val2
WHERE condition;
```

**What it does:** Modifies existing records in a table.

**When to use:** When you need to change data.

**Why use it:** To keep data up-to-date.

**Example:**

```sql
-- Update single record
UPDATE students
SET marks = 95
WHERE roll_no = 101;

-- Update multiple columns
UPDATE students
SET marks = 85, city = 'Boston'
WHERE roll_no = 102;

-- Update multiple records
UPDATE students
SET marks = marks + 5
WHERE city = 'New York';
```

---

### 11.2 DELETE Command

```sql
DELETE FROM table_name
WHERE condition;
```

**What it does:** Removes records from a table.

**When to use:** When you need to remove specific data.

**Why use it:** To clean up or remove outdated records.

**Example:**

```sql
-- Delete specific record
DELETE FROM students WHERE roll_no = 101;

-- Delete multiple records
DELETE FROM students WHERE marks < 40;

-- Delete all records (use with caution!)
DELETE FROM students;  -- Better to use TRUNCATE for this
```

---

## 12. ALTER Table

ALTER is used to change the table structure.

### 12.1 Add Column

```sql
ALTER TABLE table_name
ADD COLUMN column_name datatype constraint;
```

**What it does:** Adds a new column to an existing table.

**Example:**

```sql
ALTER TABLE students
ADD COLUMN email VARCHAR(100);
```

---

### 12.2 Drop Column

```sql
ALTER TABLE table_name
DROP COLUMN column_name;
```

**What it does:** Removes a column from a table.

**Example:**

```sql
ALTER TABLE students
DROP COLUMN email;
```

---

### 12.3 Modify Column

```sql
ALTER TABLE table_name
MODIFY column_name new_datatype new_constraint;
```

**What it does:** Changes the datatype or constraints of a column.

**Example:**

```sql
ALTER TABLE students
MODIFY name VARCHAR(100) NOT NULL;
```

---

### 12.4 Change/Rename Column

```sql
ALTER TABLE table_name
CHANGE COLUMN old_name new_name datatype constraint;
```

**What it does:** Renames a column and optionally changes its definition.

**Example:**

```sql
ALTER TABLE students
CHANGE COLUMN roll_no student_id INT;
```

---

### 12.5 Rename Table

```sql
ALTER TABLE table_name
RENAME TO new_table_name;
```

**What it does:** Renames a table.

**Example:**

```sql
ALTER TABLE students
RENAME TO learners;
```

---

## 13. Joins

Joins combine rows from two or more tables based on a related column.

### 13.1 INNER JOIN

```sql
SELECT columns
FROM table1
INNER JOIN table2
ON table1.col = table2.col;
```

**What it does:** Returns records that have matching values in both tables.

**When to use:** When you only want records that exist in both tables.

**Why use it:** To get data that has relationships in both tables.

**Example:**

```sql
-- Student and Course tables
SELECT students.name, courses.course_name
FROM students
INNER JOIN courses
ON students.student_id = courses.student_id;
```

**Visual:**

```
Table A        Table B        Result
   A               B           A ∩ B
   B               C           B
   C               D
```

---

### 13.2 LEFT JOIN

```sql
SELECT columns
FROM table1
LEFT JOIN table2
ON table1.col = table2.col;
```

**What it does:** Returns all records from left table and matched records from right table.

**When to use:** When you want all records from the first table, regardless of matches.

**Why use it:** To keep all data from the main table even if there's no match.

**Example:**

```sql
SELECT students.name, courses.course_name
FROM students
LEFT JOIN courses
ON students.student_id = courses.student_id;
-- Shows all students, even those without courses (course_name will be NULL)
```

---

### 13.3 RIGHT JOIN

```sql
SELECT columns
FROM table1
RIGHT JOIN table2
ON table1.col = table2.col;
```

**What it does:** Returns all records from right table and matched records from left table.

**When to use:** When you want all records from the second table.

**Why use it:** Opposite of LEFT JOIN.

**Example:**

```sql
SELECT students.name, courses.course_name
FROM students
RIGHT JOIN courses
ON students.student_id = courses.student_id;
-- Shows all courses, even those without students
```

---

### 13.4 FULL JOIN

```sql
-- MySQL doesn't have FULL JOIN, use UNION
SELECT columns FROM table1 LEFT JOIN table2 ON condition
UNION
SELECT columns FROM table1 RIGHT JOIN table2 ON condition;
```

**What it does:** Returns all records when there's a match in either table.

**When to use:** When you want all records from both tables.

**Why use it:** To get complete data from both tables.

**Example:**

```sql
SELECT students.name, courses.course_name
FROM students
LEFT JOIN courses ON students.student_id = courses.student_id
UNION
SELECT students.name, courses.course_name
FROM students
RIGHT JOIN courses ON students.student_id = courses.student_id;
```

---

### 13.5 Left Exclusive JOIN

```sql
SELECT columns
FROM table1
LEFT JOIN table2
ON table1.col = table2.col
WHERE table2.col IS NULL;
```

**What it does:** Returns records from left table that don't have matches in right table.

**Example:**

```sql
-- Students who haven't enrolled in any course
SELECT students.name
FROM students
LEFT JOIN courses ON students.student_id = courses.student_id
WHERE courses.course_id IS NULL;
```

---

### 13.6 Right Exclusive JOIN

```sql
SELECT columns
FROM table1
RIGHT JOIN table2
ON table1.col = table2.col
WHERE table1.col IS NULL;
```

**What it does:** Returns records from right table that don't have matches in left table.

**Example:**

```sql
-- Courses with no enrolled students
SELECT courses.course_name
FROM students
RIGHT JOIN courses ON students.student_id = courses.student_id
WHERE students.student_id IS NULL;
```

---

### 13.7 SELF JOIN

```sql
SELECT columns
FROM table AS a
JOIN table AS b
ON a.col = b.col;
```

**What it does:** Joins a table with itself.

**When to use:** When comparing rows within the same table.

**Why use it:** To find relationships within the same table.

**Example:**

```sql
-- Find employees and their managers (manager info is in same table)
SELECT e.name AS employee, m.name AS manager
FROM employees AS e
JOIN employees AS m
ON e.manager_id = m.employee_id;
```

---

## 14. UNION

```sql
SELECT columns FROM table1
UNION
SELECT columns FROM table2;
```

**What it does:** Combines result sets of two or more SELECT statements (removes duplicates).

**When to use:** When you want to combine data from multiple queries.

**Why use it:** To merge similar data from different sources.

**Rules:**

- Same number of columns in each SELECT
- Similar data types
- Columns in same order

**Example:**

```sql
-- Combine students from two different years
SELECT name, city FROM students_2023
UNION
SELECT name, city FROM students_2024;

-- Use UNION ALL to keep duplicates
SELECT name FROM students_2023
UNION ALL
SELECT name FROM students_2024;
```

---

## 15. Sub Queries

A subquery is a query within another SQL query (also called nested query or inner query).

### 15.1 Subquery in WHERE

```sql
SELECT columns
FROM table_name
WHERE col_name operator (subquery);
```

**What it does:** Uses the result of one query in another query's condition.

**When to use:** When you need to filter based on calculated or aggregated values.

**Why use it:** To break complex queries into simpler steps.

**Example:**

```sql
-- Get students who scored more than class average
SELECT name, marks
FROM students
WHERE marks > (SELECT AVG(marks) FROM students);

-- Get students with even roll numbers
SELECT name
FROM students
WHERE roll_no IN (SELECT roll_no FROM students WHERE roll_no % 2 = 0);
```

---

### 15.2 Subquery in FROM

```sql
SELECT columns
FROM (subquery) AS alias
WHERE condition;
```

**What it does:** Uses a subquery result as a temporary table.

**Example:**

```sql
-- Find max marks from students in Delhi
SELECT MAX(marks)
FROM (SELECT * FROM students WHERE city = 'Delhi') AS delhi_students;
```

---

### 15.3 Subquery with EXISTS

```sql
SELECT columns
FROM table1
WHERE EXISTS (SELECT * FROM table2 WHERE condition);
```

**What it does:** Tests for the existence of rows in subquery.

**Example:**

```sql
-- Get cities that have students
SELECT city_name
FROM cities
WHERE EXISTS (SELECT * FROM students WHERE students.city_id = cities.city_id);
```

---

## 16. Views

```sql
CREATE VIEW view_name AS
SELECT columns
FROM table_name
WHERE condition;
```

**What it does:** Creates a virtual table based on a SQL query.

**When to use:** When you frequently use the same complex query.

**Why use it:** To simplify complex queries and improve security.

**Properties:**

- Always shows up-to-date data
- Database recreates the view every time you query it

**Example:**

```sql
-- Create a view
CREATE VIEW high_achievers AS
SELECT name, marks, city
FROM students
WHERE marks > 90;

-- Use the view
SELECT * FROM high_achievers;
SELECT * FROM high_achievers WHERE city = 'New York';

-- Drop a view
DROP VIEW high_achievers;
```

---

## Types of SQL Commands

### DDL (Data Definition Language)

Commands that define database structure:

- `CREATE` - Create database or table
- `ALTER` - Modify table structure
- `DROP` - Delete database or table
- `TRUNCATE` - Delete all data from table
- `RENAME` - Rename table

### DML (Data Manipulation Language)

Commands that manipulate data:

- `INSERT` - Add new records
- `UPDATE` - Modify existing records
- `DELETE` - Remove records

### DQL (Data Query Language)

Commands that query data:

- `SELECT` - Retrieve data

### DCL (Data Control Language)

Commands that control access:

- `GRANT` - Give user permissions
- `REVOKE` - Remove user permissions

### TCL (Transaction Control Language)

Commands that manage transactions:

- `START TRANSACTION` - Begin transaction
- `COMMIT` - Save changes
- `ROLLBACK` - Undo changes

---

## Quick Reference Examples

### Complete Student Management Example

```sql
-- Create database
CREATE DATABASE school_db;
USE school_db;

-- Create table
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 5),
    city VARCHAR(50),
    marks DECIMAL(5,2) DEFAULT 0
);

-- Insert data
INSERT INTO students (name, age, city, marks) VALUES
    ('John Smith', 20, 'New York', 85.5),
    ('Sarah Jones', 21, 'Los Angeles', 92.0),
    ('Mike Brown', 19, 'Chicago', 78.5),
    ('Emily Davis', 22, 'New York', 88.0);

-- Query data
SELECT * FROM students;
SELECT name, marks FROM students WHERE marks > 80;
SELECT city, AVG(marks) FROM students GROUP BY city;

-- Update data
UPDATE students SET marks = 95.0 WHERE name = 'John Smith';

-- Delete data
DELETE FROM students WHERE marks < 70;
```

---

## Best Practices

1. **Always use WHERE with UPDATE/DELETE** to avoid modifying all rows accidentally
2. **Use meaningful names** for tables and columns
3. **Define Primary Keys** for every table
4. **Use constraints** to maintain data integrity
5. **Index frequently queried columns** for better performance
6. **Backup your database** before major changes
7. **Test queries on sample data** before running on production
8. **Use transactions** for multiple related operations

---

**Last Updated:** February 2026
