# Master PostgreSQL: Beginner to Advanced

## Table of Contents

1. [Introduction & Setup](#introduction--setup)
2. [Database Basics](#database-basics)
3. [Data Types](#data-types)
4. [CRUD Operations](#crud-operations)
5. [Queries & Filtering](#queries--filtering)
6. [Joins](#joins)
7. [Aggregations & Grouping](#aggregations--grouping)
8. [Subqueries](#subqueries)
9. [Indexes](#indexes)
10. [Constraints](#constraints)
11. [Transactions](#transactions)
12. [Views](#views)
13. [Functions & Procedures](#functions--procedures)
14. [Triggers](#triggers)
15. [Advanced Topics](#advanced-topics)

---

## 1. Introduction & Setup

### What is PostgreSQL?

PostgreSQL is an open-source, object-relational database management system (ORDBMS) known for reliability, feature robustness, and performance.

### Why PostgreSQL?

- **ACID Compliant**: Ensures data integrity
- **Extensible**: Custom functions, data types, operators
- **Standards Compliant**: Follows SQL standards
- **Advanced Features**: JSON support, full-text search, geospatial data

### Installation

```bash
# Windows (using installer from postgresql.org)
# Download and run the installer

# macOS
brew install postgresql

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
```

### Basic Commands

```bash
# Start PostgreSQL service
sudo service postgresql start

# Access PostgreSQL CLI
psql -U postgres

# Exit psql
\q
```

---

## 2. Database Basics

### Creating a Database

```sql
CREATE DATABASE company_db;
```

**Why**: Databases organize related data into logical containers.  
**When**: Create a database for each application or project.  
**How**: Use `CREATE DATABASE` command.

### Listing Databases

```sql
-- In psql
\l

-- SQL query
SELECT datname FROM pg_database;
```

### Connecting to a Database

```sql
-- In psql
\c company_db
```

### Dropping a Database

```sql
DROP DATABASE company_db;
```

**⚠️ Warning**: This permanently deletes all data!

---

## 3. Data Types

### Numeric Types

```sql
-- Integer types
SMALLINT    -- -32,768 to 32,767
INTEGER     -- -2 billion to 2 billion
BIGINT      -- Very large numbers

-- Decimal types
DECIMAL(10,2)  -- Exact decimal (10 digits, 2 after decimal)
NUMERIC(10,2)  -- Same as DECIMAL
REAL           -- Floating point (6 decimal precision)
DOUBLE PRECISION -- Floating point (15 decimal precision)

-- Serial (auto-increment)
SERIAL       -- Auto-incrementing integer
BIGSERIAL    -- Auto-incrementing bigint
```

**Example**:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2),
    stock INTEGER
);
```

**Why**: Different numeric types optimize storage and performance.  
**When**: Use INTEGER for IDs, DECIMAL for money, SERIAL for auto-increment.

### String Types

```sql
CHAR(n)        -- Fixed length
VARCHAR(n)     -- Variable length with limit
TEXT           -- Unlimited length
```

**Example**:

```sql
CREATE TABLE users (
    username VARCHAR(50),
    bio TEXT,
    country_code CHAR(2)
);
```

**When**: Use VARCHAR for limited strings, TEXT for long content, CHAR for fixed codes.

### Date/Time Types

```sql
DATE           -- Date only (YYYY-MM-DD)
TIME           -- Time only (HH:MM:SS)
TIMESTAMP      -- Date and time
TIMESTAMPTZ    -- Timestamp with timezone
INTERVAL       -- Time duration
```

**Example**:

```sql
CREATE TABLE events (
    event_name VARCHAR(100),
    event_date DATE,
    event_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Boolean

```sql
BOOLEAN  -- TRUE, FALSE, NULL
```

**Example**:

```sql
CREATE TABLE users (
    username VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);
```

### JSON Types

```sql
JSON      -- Stores JSON as text
JSONB     -- Binary JSON (faster, indexable)
```

**Example**:

```sql
CREATE TABLE user_preferences (
    user_id INTEGER,
    settings JSONB
);

INSERT INTO user_preferences VALUES
(1, '{"theme": "dark", "notifications": true}');
```

**Why**: JSONB is faster for queries and supports indexing.  
**When**: Use for flexible, semi-structured data.

---

## 4. CRUD Operations

### CREATE (Insert Data)

**Single Row**:

```sql
INSERT INTO products (name, price, stock)
VALUES ('Laptop', 999.99, 50);
```

**Multiple Rows**:

```sql
INSERT INTO products (name, price, stock)
VALUES
    ('Mouse', 29.99, 200),
    ('Keyboard', 79.99, 150),
    ('Monitor', 299.99, 75);
```

**With RETURNING**:

```sql
INSERT INTO products (name, price, stock)
VALUES ('Webcam', 89.99, 100)
RETURNING id, name;
```

**Why**: RETURNING shows inserted data without a separate SELECT.

### READ (Select Data)

**Select All**:

```sql
SELECT * FROM products;
```

**Select Specific Columns**:

```sql
SELECT name, price FROM products;
```

**With Alias**:

```sql
SELECT name AS product_name, price AS cost
FROM products;
```

### UPDATE (Modify Data)

```sql
UPDATE products
SET price = 899.99
WHERE name = 'Laptop';
```

**Update Multiple Columns**:

```sql
UPDATE products
SET price = 899.99, stock = 45
WHERE name = 'Laptop';
```

**⚠️ Important**: Always use WHERE clause to avoid updating all rows!

### DELETE (Remove Data)

```sql
DELETE FROM products
WHERE name = 'Mouse';
```

**Delete All Rows**:

```sql
DELETE FROM products;  -- Dangerous!
```

**Better Alternative (TRUNCATE)**:

```sql
TRUNCATE TABLE products;  -- Faster, resets auto-increment
```

---

## 5. Queries & Filtering

### WHERE Clause

**Comparison Operators**:

```sql
SELECT * FROM products WHERE price > 100;
SELECT * FROM products WHERE price <= 50;
SELECT * FROM products WHERE name = 'Laptop';
SELECT * FROM products WHERE name != 'Mouse';
```

**Logical Operators**:

```sql
-- AND
SELECT * FROM products
WHERE price > 50 AND stock < 100;

-- OR
SELECT * FROM products
WHERE price < 30 OR price > 500;

-- NOT
SELECT * FROM products
WHERE NOT price > 100;
```

### Pattern Matching (LIKE)

```sql
-- Starts with 'M'
SELECT * FROM products WHERE name LIKE 'M%';

-- Ends with 'top'
SELECT * FROM products WHERE name LIKE '%top';

-- Contains 'key'
SELECT * FROM products WHERE name LIKE '%key%';

-- Case-insensitive
SELECT * FROM products WHERE name ILIKE '%laptop%';
```

**Why**: LIKE is for pattern matching, ILIKE ignores case.

### IN Operator

```sql
SELECT * FROM products
WHERE name IN ('Laptop', 'Mouse', 'Keyboard');
```

### BETWEEN

```sql
SELECT * FROM products
WHERE price BETWEEN 50 AND 300;
```

### NULL Handling

```sql
SELECT * FROM products WHERE description IS NULL;
SELECT * FROM products WHERE description IS NOT NULL;
```

**Why**: Use IS NULL, not = NULL (NULL is unknown, not a value).

### ORDER BY

```sql
-- Ascending (default)
SELECT * FROM products ORDER BY price;

-- Descending
SELECT * FROM products ORDER BY price DESC;

-- Multiple columns
SELECT * FROM products
ORDER BY stock DESC, price ASC;
```

### LIMIT & OFFSET

```sql
-- First 5 products
SELECT * FROM products LIMIT 5;

-- Skip 5, get next 5 (pagination)
SELECT * FROM products LIMIT 5 OFFSET 5;
```

**When**: Use for pagination in web applications.

### DISTINCT

```sql
SELECT DISTINCT category FROM products;
```

**Why**: Removes duplicate values from results.

---

## 6. Joins

### Sample Tables

```sql
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(50)
);

CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    emp_name VARCHAR(100),
    dept_id INTEGER,
    salary DECIMAL(10,2)
);

INSERT INTO departments (dept_name) VALUES
('Sales'), ('IT'), ('HR');

INSERT INTO employees (emp_name, dept_id, salary) VALUES
('John', 1, 50000),
('Jane', 2, 60000),
('Bob', 2, 55000),
('Alice', NULL, 45000);
```

### INNER JOIN

```sql
SELECT e.emp_name, d.dept_name, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;
```

**Result**: Only employees WITH departments.

**Why**: Returns only matching rows from both tables.  
**When**: Use when you need data that exists in both tables.

### LEFT JOIN (LEFT OUTER JOIN)

```sql
SELECT e.emp_name, d.dept_name, e.salary
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;
```

**Result**: All employees, even without departments (Alice included).

**Why**: Returns all rows from left table, matched rows from right.  
**When**: Use when you need all records from the main table.

### RIGHT JOIN

```sql
SELECT e.emp_name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id;
```

**Result**: All departments, even without employees (HR included).

### FULL OUTER JOIN

```sql
SELECT e.emp_name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;
```

**Result**: All employees AND all departments.

**When**: Use when you need all records from both tables.

### CROSS JOIN

```sql
SELECT e.emp_name, d.dept_name
FROM employees e
CROSS JOIN departments d;
```

**Result**: Cartesian product (every employee with every department).

**When**: Rarely used; useful for generating combinations.

### SELF JOIN

```sql
CREATE TABLE employees_with_manager (
    emp_id SERIAL PRIMARY KEY,
    emp_name VARCHAR(100),
    manager_id INTEGER
);

SELECT e.emp_name AS employee, m.emp_name AS manager
FROM employees_with_manager e
LEFT JOIN employees_with_manager m ON e.manager_id = m.emp_id;
```

**Why**: Join a table to itself to find relationships within the same table.

---

## 7. Aggregations & Grouping

### Aggregate Functions

```sql
-- COUNT
SELECT COUNT(*) FROM products;
SELECT COUNT(DISTINCT category) FROM products;

-- SUM
SELECT SUM(stock) FROM products;

-- AVG
SELECT AVG(price) FROM products;

-- MIN/MAX
SELECT MIN(price), MAX(price) FROM products;
```

### GROUP BY

```sql
SELECT category, COUNT(*) as product_count
FROM products
GROUP BY category;
```

**Example with Multiple Aggregates**:

```sql
SELECT
    category,
    COUNT(*) as total_products,
    AVG(price) as avg_price,
    SUM(stock) as total_stock
FROM products
GROUP BY category;
```

**Why**: GROUP BY groups rows with same values for aggregation.  
**When**: Use when you need statistics per category/group.

### HAVING

```sql
SELECT category, AVG(price) as avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 100;
```

**Why**: HAVING filters groups (after GROUP BY), WHERE filters rows (before).  
**When**: Use HAVING to filter aggregated results.

**Example**:

```sql
-- Find departments with average salary > 50000
SELECT dept_id, AVG(salary) as avg_salary
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 50000;
```

---

## 8. Subqueries

### Subquery in WHERE

```sql
-- Find products more expensive than average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

### Subquery with IN

```sql
-- Find employees in IT or Sales departments
SELECT emp_name
FROM employees
WHERE dept_id IN (
    SELECT dept_id
    FROM departments
    WHERE dept_name IN ('IT', 'Sales')
);
```

### Subquery in FROM (Derived Table)

```sql
SELECT category, avg_price
FROM (
    SELECT category, AVG(price) as avg_price
    FROM products
    GROUP BY category
) AS category_stats
WHERE avg_price > 100;
```

### Correlated Subquery

```sql
-- Find employees earning more than their department average
SELECT e1.emp_name, e1.salary
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.dept_id = e1.dept_id
);
```

**Why**: Correlated subquery references outer query (runs for each row).  
**When**: Use when you need row-by-row comparison.

### EXISTS

```sql
-- Find departments with employees
SELECT dept_name
FROM departments d
WHERE EXISTS (
    SELECT 1
    FROM employees e
    WHERE e.dept_id = d.dept_id
);
```

**Why**: EXISTS is faster than IN for checking existence.

---

## 9. Indexes

### What are Indexes?

Indexes speed up data retrieval by creating a sorted lookup structure.

**Analogy**: Like a book index - instead of reading every page, jump to the right section.

### Creating Indexes

```sql
-- Single column index
CREATE INDEX idx_products_name ON products(name);

-- Multi-column index
CREATE INDEX idx_emp_dept_salary ON employees(dept_id, salary);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

### When to Use Indexes

**✅ Use indexes for**:

- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Foreign keys

**❌ Avoid indexes for**:

- Small tables
- Columns with frequent updates
- Columns with low cardinality (few unique values)

### Index Types

```sql
-- B-tree (default, most common)
CREATE INDEX idx_price ON products(price);

-- Hash (for equality comparisons only)
CREATE INDEX idx_hash_email ON users USING HASH(email);

-- GIN (for arrays, JSON, full-text search)
CREATE INDEX idx_tags ON articles USING GIN(tags);

-- GiST (for geometric data, full-text search)
CREATE INDEX idx_location ON places USING GIST(location);
```

### Viewing Indexes

```sql
-- List indexes
\di

-- Show indexes for a table
SELECT * FROM pg_indexes WHERE tablename = 'products';
```

### Dropping Indexes

```sql
DROP INDEX idx_products_name;
```

---

## 10. Constraints

### PRIMARY KEY

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50)
);

-- Or
CREATE TABLE users (
    id SERIAL,
    username VARCHAR(50),
    PRIMARY KEY (id)
);
```

**Why**: Uniquely identifies each row.  
**When**: Every table should have a primary key.

### FOREIGN KEY

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**With Actions**:

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

**Options**:

- `CASCADE`: Delete/update related rows
- `SET NULL`: Set foreign key to NULL
- `RESTRICT`: Prevent deletion/update
- `NO ACTION`: Similar to RESTRICT

**Why**: Maintains referential integrity between tables.

### UNIQUE

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(50) UNIQUE
);
```

**Why**: Ensures no duplicate values.

### NOT NULL

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
```

### CHECK

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2) CHECK (price > 0),
    stock INTEGER CHECK (stock >= 0)
);

-- Named constraint
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    salary DECIMAL(10,2),
    CONSTRAINT positive_salary CHECK (salary > 0)
);
```

**Why**: Enforces business rules at database level.

### DEFAULT

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## 11. Transactions

### What are Transactions?

A transaction is a sequence of operations performed as a single logical unit of work.

### ACID Properties

- **Atomicity**: All or nothing
- **Consistency**: Database remains valid
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed changes persist

### Basic Transaction

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

COMMIT;
```

**Why**: Ensures both updates happen or neither happens.

### Rollback

```sql
BEGIN;

UPDATE products SET stock = stock - 10 WHERE id = 1;

-- Oops, made a mistake!
ROLLBACK;
```

### Savepoints

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;

SAVEPOINT my_savepoint;

UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

-- Rollback to savepoint (undo second update only)
ROLLBACK TO SAVEPOINT my_savepoint;

COMMIT;
```

**When**: Use savepoints for partial rollbacks in complex transactions.

### Isolation Levels

```sql
-- Set isolation level
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

BEGIN;
-- Your queries
COMMIT;
```

**Levels**:

1. **READ UNCOMMITTED**: Dirty reads possible
2. **READ COMMITTED**: Default in PostgreSQL
3. **REPEATABLE READ**: Prevents non-repeatable reads
4. **SERIALIZABLE**: Strictest, prevents phantom reads

---

## 12. Views

### Creating Views

```sql
CREATE VIEW expensive_products AS
SELECT name, price, stock
FROM products
WHERE price > 500;
```

**Using the View**:

```sql
SELECT * FROM expensive_products;
```

**Why**: Views simplify complex queries and provide abstraction.  
**When**: Use for frequently used queries or to hide complexity.

### Updatable Views

```sql
CREATE VIEW active_users AS
SELECT id, username, email
FROM users
WHERE is_active = TRUE;

-- You can INSERT/UPDATE/DELETE on simple views
UPDATE active_users SET email = 'new@email.com' WHERE id = 1;
```

### Materialized Views

```sql
CREATE MATERIALIZED VIEW product_stats AS
SELECT
    category,
    COUNT(*) as total_products,
    AVG(price) as avg_price
FROM products
GROUP BY category;
```

**Refresh Materialized View**:

```sql
REFRESH MATERIALIZED VIEW product_stats;
```

**Why**: Materialized views cache results for faster queries.  
**When**: Use for expensive queries that don't need real-time data.

### Dropping Views

```sql
DROP VIEW expensive_products;
DROP MATERIALIZED VIEW product_stats;
```

---

## 13. Functions & Procedures

### Creating Functions

```sql
CREATE FUNCTION get_total_stock()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT SUM(stock) FROM products);
END;
$$ LANGUAGE plpgsql;
```

**Using the Function**:

```sql
SELECT get_total_stock();
```

### Function with Parameters

```sql
CREATE FUNCTION get_product_count(min_price DECIMAL)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM products WHERE price >= min_price);
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT get_product_count(100);
```

### Function Returning Table

```sql
CREATE FUNCTION get_expensive_products(min_price DECIMAL)
RETURNS TABLE(product_name VARCHAR, product_price DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT name, price
    FROM products
    WHERE price >= min_price;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT * FROM get_expensive_products(500);
```

### Stored Procedures (PostgreSQL 11+)

```sql
CREATE PROCEDURE update_product_price(
    p_id INTEGER,
    p_new_price DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET price = p_new_price
    WHERE id = p_id;

    COMMIT;
END;
$$;

-- Call procedure
CALL update_product_price(1, 899.99);
```

**Difference**: Functions return values, procedures don't (but can have OUT parameters).

---

## 14. Triggers

### What are Triggers?

Triggers automatically execute functions when specific events occur.

### Creating a Trigger Function

```sql
CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50),
    action VARCHAR(10),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, action)
    VALUES (TG_TABLE_NAME, TG_OP);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Creating the Trigger

```sql
CREATE TRIGGER product_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION log_product_changes();
```

**Trigger Timing**:

- `BEFORE`: Execute before the operation
- `AFTER`: Execute after the operation
- `INSTEAD OF`: Replace the operation (for views)

**Trigger Events**:

- `INSERT`
- `UPDATE`
- `DELETE`
- `TRUNCATE`

### Example: Auto-Update Timestamp

```sql
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
```

**Why**: Triggers automate tasks and enforce business logic.  
**When**: Use for auditing, validation, or automatic updates.

### Dropping Triggers

```sql
DROP TRIGGER product_audit_trigger ON products;
```

---

## 15. Advanced Topics

### Window Functions

```sql
-- Row number
SELECT
    name,
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) as rank
FROM products;

-- Rank with gaps
SELECT
    name,
    price,
    RANK() OVER (ORDER BY price DESC) as rank
FROM products;

-- Partition by category
SELECT
    category,
    name,
    price,
    AVG(price) OVER (PARTITION BY category) as category_avg
FROM products;
```

**Why**: Window functions perform calculations across rows without grouping.

### Common Table Expressions (CTE)

```sql
WITH expensive_products AS (
    SELECT * FROM products WHERE price > 500
),
cheap_products AS (
    SELECT * FROM products WHERE price < 100
)
SELECT
    (SELECT COUNT(*) FROM expensive_products) as expensive_count,
    (SELECT COUNT(*) FROM cheap_products) as cheap_count;
```

**Recursive CTE**:

```sql
WITH RECURSIVE numbers AS (
    SELECT 1 as n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 10
)
SELECT * FROM numbers;
```

### CASE Expressions

```sql
SELECT
    name,
    price,
    CASE
        WHEN price < 100 THEN 'Cheap'
        WHEN price < 500 THEN 'Moderate'
        ELSE 'Expensive'
    END as price_category
FROM products;
```

### COALESCE & NULLIF

```sql
-- COALESCE: Return first non-null value
SELECT COALESCE(description, 'No description') FROM products;

-- NULLIF: Return NULL if values are equal
SELECT NULLIF(stock, 0) FROM products;
```

### Array Operations

```sql
-- Create array column
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    tags TEXT[]
);

-- Insert with array
INSERT INTO articles (title, tags)
VALUES ('PostgreSQL Guide', ARRAY['database', 'sql', 'tutorial']);

-- Query array
SELECT * FROM articles WHERE 'database' = ANY(tags);
SELECT * FROM articles WHERE tags @> ARRAY['sql'];
```

### JSON Operations

```sql
-- Query JSONB
SELECT * FROM user_preferences
WHERE settings->>'theme' = 'dark';

-- Update JSONB
UPDATE user_preferences
SET settings = settings || '{"language": "en"}'
WHERE user_id = 1;

-- Extract value
SELECT settings->'notifications' FROM user_preferences;
SELECT settings->>'notifications' FROM user_preferences; -- As text
```

### Full-Text Search

```sql
-- Add tsvector column
ALTER TABLE articles ADD COLUMN search_vector tsvector;

-- Update search vector
UPDATE articles
SET search_vector = to_tsvector('english', title || ' ' || content);

-- Create index
CREATE INDEX idx_search ON articles USING GIN(search_vector);

-- Search
SELECT * FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgresql & guide');
```

### Partitioning

```sql
-- Range partitioning
CREATE TABLE sales (
    sale_id SERIAL,
    sale_date DATE,
    amount DECIMAL(10,2)
) PARTITION BY RANGE (sale_date);

CREATE TABLE sales_2024 PARTITION OF sales
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE sales_2025 PARTITION OF sales
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

**Why**: Partitioning improves performance for large tables.  
**When**: Use for tables with time-series data or natural divisions.

### EXPLAIN & Query Optimization

```sql
-- See query execution plan
EXPLAIN SELECT * FROM products WHERE price > 100;

-- See actual execution with timing
EXPLAIN ANALYZE SELECT * FROM products WHERE price > 100;
```

**Reading EXPLAIN**:

- **Seq Scan**: Full table scan (slow for large tables)
- **Index Scan**: Using index (fast)
- **Cost**: Estimated cost (lower is better)
- **Rows**: Estimated rows returned

---

## Best Practices

### 1. Naming Conventions

- Use lowercase with underscores: `user_orders`, not `UserOrders`
- Plural for tables: `users`, `products`
- Singular for columns: `user_id`, not `users_id`

### 2. Always Use Transactions for Multiple Operations

```sql
BEGIN;
-- Multiple related operations
COMMIT;
```

### 3. Index Foreign Keys

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### 4. Use LIMIT for Testing

```sql
SELECT * FROM large_table LIMIT 100;
```

### 5. Avoid SELECT \*

```sql
-- Bad
SELECT * FROM users;

-- Good
SELECT id, username, email FROM users;
```

### 6. Use Prepared Statements (Prevent SQL Injection)

```sql
-- In application code (example: Node.js)
const query = 'SELECT * FROM users WHERE id = $1';
const values = [userId];
await client.query(query, values);
```

### 7. Regular Maintenance

```sql
-- Analyze tables for query planner
ANALYZE products;

-- Vacuum to reclaim storage
VACUUM products;

-- Full vacuum (locks table)
VACUUM FULL products;
```

---

## Quick Reference

### psql Commands

```
\l              -- List databases
\c dbname       -- Connect to database
\dt             -- List tables
\d tablename    -- Describe table
\di             -- List indexes
\df             -- List functions
\dv             -- List views
\du             -- List users
\q              -- Quit
\?              -- Help
```

### Common Patterns

**Pagination**:

```sql
SELECT * FROM products
ORDER BY id
LIMIT 20 OFFSET 40;  -- Page 3 (20 per page)
```

**Upsert (INSERT or UPDATE)**:

```sql
INSERT INTO products (id, name, price)
VALUES (1, 'Laptop', 999.99)
ON CONFLICT (id)
DO UPDATE SET price = EXCLUDED.price;
```

**Find Duplicates**:

```sql
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

**Random Sample**:

```sql
SELECT * FROM products
ORDER BY RANDOM()
LIMIT 10;
```

---

## Conclusion

This guide covers PostgreSQL from basics to advanced topics. Practice is key:

1. **Start Simple**: Create databases, tables, basic CRUD
2. **Practice Queries**: Joins, aggregations, subqueries
3. **Optimize**: Learn indexes, EXPLAIN, query optimization
4. **Advanced Features**: Triggers, functions, window functions
5. **Real Projects**: Build applications using PostgreSQL

**Resources**:

- Official Docs: https://www.postgresql.org/docs/
- Practice: https://pgexercises.com/
- Community: https://www.postgresql.org/community/

Happy Learning! 🚀
