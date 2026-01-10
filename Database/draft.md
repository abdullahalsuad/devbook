## SQL QUERY - ADVANCED SELECT OPERATIONS

---

## **A) SELECT, INSERT, UPDATE, DELETE - Review & Advanced**

### **Advanced SELECT Techniques**

#### **1. Column Aliases (Renaming Columns in Output)**

```sql
-- Basic alias
SELECT name AS student_name, age AS student_age
FROM Students;

-- Without AS keyword (also valid)
SELECT name student_name, age student_age
FROM Students;

-- Alias with spaces (use quotes)
SELECT name AS "Student Full Name", age AS "Age in Years"
FROM Students;

-- Calculated column with alias
SELECT name, price, price * 1.15 AS price_with_tax
FROM Products;
```

**Output Example:**

```
| student_name | student_age |
|--------------|-------------|
| John Doe     | 20          |
| Jane Smith   | 22          |
```

---

#### **2. Table Aliases (Shorthand for Table Names)**

```sql
-- Useful when table names are long
SELECT s.name, s.age, s.email
FROM Students AS s
WHERE s.age > 20;

-- Essential when joining tables (we'll cover this in Section 7)
SELECT s.name, e.course_name
FROM Students s
JOIN Enrollments e ON s.student_id = e.student_id;
```

---

#### **3. DISTINCT - Remove Duplicates**

```sql
-- Get unique ages (no duplicates)
SELECT DISTINCT age FROM Students;

-- Get unique combinations
SELECT DISTINCT city, country FROM Students;

-- Count unique values
SELECT COUNT(DISTINCT age) AS unique_ages FROM Students;
```

**Example:**

```sql
-- Data in table:
age: 20, 21, 20, 22, 21, 20

-- Query:
SELECT DISTINCT age FROM Students ORDER BY age;

-- Result:
20
21
22
```

---

## **B) WHERE vs HAVING**

This is a **critical concept** that confuses many beginners. Let me explain clearly.

### **WHERE Clause**

- **Used:** To filter rows **BEFORE** grouping
- **Works with:** Individual rows
- **Cannot use:** Aggregate functions (SUM, COUNT, AVG, etc.)
- **Position:** After FROM, before GROUP BY

### **HAVING Clause**

- **Used:** To filter groups **AFTER** grouping
- **Works with:** Groups of rows
- **Can use:** Aggregate functions
- **Position:** After GROUP BY

---

### **Simple Example - WHERE:**

```sql
-- Show students older than 20
SELECT name, age
FROM Students
WHERE age > 20;

-- This filters individual rows BEFORE any processing
```

---

### **Simple Example - HAVING:**

```sql
-- Show ages that appear more than twice
SELECT age, COUNT(*) AS student_count
FROM Students
GROUP BY age
HAVING COUNT(*) > 2;

-- This filters groups AFTER counting
```

---

### **Side-by-Side Comparison:**

```sql
-- Example 1: WHERE (filters rows before grouping)
SELECT department, AVG(salary) AS avg_salary
FROM Employees
WHERE salary > 30000  -- Filter individual employees first
GROUP BY department;

-- Explanation:
-- Step 1: Filter employees with salary > 30000
-- Step 2: Group remaining employees by department
-- Step 3: Calculate average for each department


-- Example 2: HAVING (filters groups after grouping)
SELECT department, AVG(salary) AS avg_salary
FROM Employees
GROUP BY department
HAVING AVG(salary) > 50000;  -- Filter departments after averaging

-- Explanation:
-- Step 1: Group all employees by department
-- Step 2: Calculate average salary for each department
-- Step 3: Show only departments where average > 50000
```

---

### **Using Both WHERE and HAVING Together:**

```sql
SELECT department, AVG(salary) AS avg_salary
FROM Employees
WHERE hire_date > '2020-01-01'      -- First: filter individual employees
GROUP BY department                  -- Then: group by department
HAVING AVG(salary) > 45000          -- Finally: filter departments
ORDER BY avg_salary DESC;            -- And: sort results

-- Execution order:
-- 1. WHERE: Keep only employees hired after 2020
-- 2. GROUP BY: Group them by department
-- 3. HAVING: Keep only departments with avg salary > 45000
-- 4. ORDER BY: Sort by average salary (highest first)
```

---

### **Real-World Example:**

**Scenario:** Find departments with more than 5 senior employees (experience > 5 years) and average salary > 60000

```sql
SELECT
    department,
    COUNT(*) AS senior_employee_count,
    AVG(salary) AS avg_salary
FROM Employees
WHERE experience_years > 5           -- Filter: only senior employees
GROUP BY department                  -- Group: by department
HAVING COUNT(*) > 5                  -- Filter groups: more than 5 seniors
   AND AVG(salary) > 60000          -- Filter groups: high average salary
ORDER BY avg_salary DESC;

-- Result might be:
-- | department | senior_employee_count | avg_salary |
-- |------------|----------------------|------------|
-- | IT         | 8                    | 75000      |
-- | Finance    | 6                    | 68000      |
```

---

### **Common Mistakes:**

❌ **Wrong - Using aggregate function in WHERE:**

```sql
-- This will cause an ERROR
SELECT department, AVG(salary)
FROM Employees
WHERE AVG(salary) > 50000  -- ❌ Cannot use aggregate in WHERE
GROUP BY department;
```

✅ **Correct - Use HAVING instead:**

```sql
SELECT department, AVG(salary)
FROM Employees
GROUP BY department
HAVING AVG(salary) > 50000;  -- ✓ Correct
```

---

❌ **Wrong - Using non-aggregated column in HAVING:**

```sql
-- This is confusing and may error
SELECT department, AVG(salary)
FROM Employees
GROUP BY department
HAVING salary > 50000;  -- ❌ Which salary? There are many per group
```

✅ **Correct - Use WHERE for individual row filters:**

```sql
SELECT department, AVG(salary)
FROM Employees
WHERE salary > 50000    -- ✓ Filter individual salaries first
GROUP BY department;
```

---

### **Quick Decision Guide:**

**Use WHERE when:**

- Filtering individual rows
- Before any grouping
- Not using aggregate functions

**Use HAVING when:**

- Filtering groups
- After grouping
- Using aggregate functions (COUNT, SUM, AVG, MIN, MAX)

---

## **C) GROUP BY and ORDER BY**

### **GROUP BY - Grouping Rows**

**Purpose:** Combine rows with the same values in specified columns and perform calculations on each group.

#### **Basic Syntax:**

```sql
SELECT column1, aggregate_function(column2)
FROM table_name
GROUP BY column1;
```

---

#### **Simple Examples:**

**Example 1: Count students by age**

```sql
SELECT age, COUNT(*) AS student_count
FROM Students
GROUP BY age;

-- Result:
-- | age | student_count |
-- |-----|---------------|
-- | 20  | 15            |
-- | 21  | 12            |
-- | 22  | 10            |
```

**Explanation:**

- Groups all students with age 20 together
- Counts how many students in each group
- Returns one row per unique age

---

**Example 2: Average salary by department**

```sql
SELECT department, AVG(salary) AS avg_salary
FROM Employees
GROUP BY department;

-- Result:
-- | department | avg_salary |
-- |------------|------------|
-- | IT         | 65000      |
-- | Sales      | 55000      |
-- | HR         | 50000      |
```

---

**Example 3: Multiple columns in GROUP BY**

```sql
SELECT city, country, COUNT(*) AS student_count
FROM Students
GROUP BY city, country;

-- Result:
-- | city  | country    | student_count |
-- |-------|------------|---------------|
-- | Dhaka | Bangladesh | 50            |
-- | Dhaka | India      | 5             |
-- | Delhi | India      | 30            |
```

**Explanation:** Groups by the combination of city AND country (Dhaka, Bangladesh is different from Dhaka, India)

---

#### **Important GROUP BY Rules:**

**Rule 1:** Every column in SELECT (except aggregates) must be in GROUP BY

❌ **Wrong:**

```sql
SELECT department, name, AVG(salary)
FROM Employees
GROUP BY department;
-- ERROR: 'name' is not in GROUP BY
```

✅ **Correct:**

```sql
SELECT department, AVG(salary)
FROM Employees
GROUP BY department;

-- OR include name in GROUP BY:
SELECT department, name, AVG(salary)
FROM Employees
GROUP BY department, name;
```

---

**Rule 2:** You can use aggregate functions with GROUP BY

Common aggregate functions:

- `COUNT(*)` - Count rows in each group
- `SUM(column)` - Sum values in each group
- `AVG(column)` - Average values in each group
- `MIN(column)` - Minimum value in each group
- `MAX(column)` - Maximum value in each group

```sql
SELECT
    department,
    COUNT(*) AS employee_count,
    SUM(salary) AS total_salary,
    AVG(salary) AS avg_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary
FROM Employees
GROUP BY department;
```

---

**Rule 3:** NULL values are treated as one group

```sql
SELECT city, COUNT(*) AS count
FROM Students
GROUP BY city;

-- If some students have NULL city, they'll be grouped together:
-- | city  | count |
-- |-------|-------|
-- | Dhaka | 50    |
-- | NULL  | 5     |  <-- All NULL cities in one group
```

---

### **ORDER BY - Sorting Results**

**Purpose:** Sort the result set by one or more columns

#### **Basic Syntax:**

```sql
SELECT columns
FROM table_name
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC];
```

- **ASC** - Ascending order (default, A-Z, 0-9)
- **DESC** - Descending order (Z-A, 9-0)

---

#### **Examples:**

**Example 1: Sort by single column**

```sql
-- Ascending (default)
SELECT name, age FROM Students ORDER BY age;

-- Descending
SELECT name, age FROM Students ORDER BY age DESC;
```

---

**Example 2: Sort by multiple columns**

```sql
SELECT name, age, city
FROM Students
ORDER BY age DESC, name ASC;

-- Explanation:
-- 1. First sort by age (highest to lowest)
-- 2. If ages are same, sort by name (A to Z)

-- Result:
-- | name         | age | city  |
-- |--------------|-----|-------|
-- | Alice Brown  | 23  | Dhaka |
-- | Bob Wilson   | 23  | Dhaka |  <- Same age, sorted by name
-- | Charlie Lee  | 22  | Delhi |
-- | David Kim    | 20  | Dhaka |
```

---

**Example 3: Sort by calculated column**

```sql
SELECT name, price, price * 0.15 AS tax
FROM Products
ORDER BY price * 0.15 DESC;

-- OR use alias:
SELECT name, price, price * 0.15 AS tax
FROM Products
ORDER BY tax DESC;
```

---

**Example 4: Sort by column position (not recommended, but possible)**

```sql
SELECT name, age, city
FROM Students
ORDER BY 2 DESC, 1 ASC;
-- 2 means 2nd column (age)
-- 1 means 1st column (name)

-- This is less clear, better to use column names
```

---

**Example 5: Sort with NULL handling**

```sql
-- NULLs appear first by default in ASC
SELECT name, email FROM Students ORDER BY email;

-- Put NULLs last
SELECT name, email FROM Students ORDER BY email NULLS LAST;

-- Put NULLs first in DESC
SELECT name, email FROM Students ORDER BY email DESC NULLS FIRST;
```

---

### **GROUP BY with ORDER BY - Complete Example:**

```sql
-- Find departments with more than 10 employees,
-- show their average salary,
-- sorted by highest average first

SELECT
    department,
    COUNT(*) AS emp_count,
    AVG(salary) AS avg_salary,
    MAX(salary) AS highest_salary
FROM Employees
WHERE status = 'active'              -- 1. Filter active employees
GROUP BY department                  -- 2. Group by department
HAVING COUNT(*) > 10                 -- 3. Filter groups with > 10 employees
ORDER BY avg_salary DESC, emp_count DESC;  -- 4. Sort by avg_salary, then count

-- Execution Order (Important!):
-- 1. FROM: Get data from Employees table
-- 2. WHERE: Filter to active employees only
-- 3. GROUP BY: Group remaining rows by department
-- 4. HAVING: Filter groups to those with > 10 employees
-- 5. SELECT: Calculate the aggregates
-- 6. ORDER BY: Sort the final results
```

---

### **Real-World Example - Sales Report:**

```sql
-- Monthly sales report: total sales and order count per product category
SELECT
    category,
    MONTH(order_date) AS month,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_sales,
    AVG(amount) AS avg_order_value,
    MAX(amount) AS largest_order
FROM Orders
WHERE YEAR(order_date) = 2024
GROUP BY category, MONTH(order_date)
HAVING SUM(amount) > 100000  -- Only categories with >100K sales
ORDER BY month ASC, total_sales DESC;

-- Result:
-- | category    | month | total_orders | total_sales | avg_order_value | largest_order |
-- |-------------|-------|--------------|-------------|-----------------|---------------|
-- | Electronics | 1     | 150          | 500000      | 3333            | 50000         |
-- | Clothing    | 1     | 300          | 250000      | 833             | 5000          |
-- | Electronics | 2     | 200          | 600000      | 3000            | 45000         |
```

---

### **Common Patterns:**

**Pattern 1: Top N per group**

```sql
-- Top 3 highest paid employees per department
SELECT department, name, salary
FROM (
    SELECT
        department,
        name,
        salary,
        ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
    FROM Employees
) AS ranked
WHERE rank <= 3
ORDER BY department, rank;
```

**Pattern 2: Percentage of total**

```sql
-- Each department's percentage of total employees
SELECT
    department,
    COUNT(*) AS dept_count,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Employees) AS percentage
FROM Employees
GROUP BY department
ORDER BY percentage DESC;
```

**Pattern 3: Running totals**

```sql
-- Cumulative sales by date
SELECT
    order_date,
    SUM(amount) AS daily_sales,
    SUM(SUM(amount)) OVER (ORDER BY order_date) AS cumulative_sales
FROM Orders
GROUP BY order_date
ORDER BY order_date;
```

---

## **D) UNION and UNION ALL**

### **What are UNION operations?**

UNION operations combine results from two or more SELECT statements into a single result set.

---

### **UNION - Combines and Removes Duplicates**

**Syntax:**

```sql
SELECT column1, column2 FROM table1
UNION
SELECT column1, column2 FROM table2;
```

**Rules:**

1. Both SELECT statements must have the **same number of columns**
2. Columns must have **compatible data types**
3. Column names from the **first SELECT** are used
4. **Removes duplicate rows**
5. Results are **sorted by default** (in some databases)

---

**Example 1: Combine students from two campuses**

```sql
SELECT student_id, name, 'Main Campus' AS campus
FROM MainCampusStudents
UNION
SELECT student_id, name, 'Branch Campus' AS campus
FROM BranchCampusStudents;

-- If a student appears in both tables, they appear only once
```

---

**Example 2: Combine current and archived employees**

```sql
SELECT emp_id, name, email FROM CurrentEmployees
UNION
SELECT emp_id, name, email FROM ArchivedEmployees;

-- Duplicates are automatically removed
```

---

### **UNION ALL - Combines and Keeps All Duplicates**

**Syntax:**

```sql
SELECT column1, column2 FROM table1
UNION ALL
SELECT column1, column2 FROM table2;
```

**Key Difference:** UNION ALL keeps **all rows**, including duplicates, and is **faster** because it doesn't need to check for duplicates.

---

**Example 1: All transactions (even if duplicated)**

```sql
SELECT transaction_id, amount, 'Online' AS source
FROM OnlineTransactions
UNION ALL
SELECT transaction_id, amount, 'Offline' AS source
FROM OfflineTransactions;

-- If same transaction is in both tables, it appears twice
```

---

**Example 2: Quarterly sales reports**

```sql
SELECT 'Q1' AS quarter, product, SUM(sales) AS total_sales
FROM Q1_Sales
GROUP BY product
UNION ALL
SELECT 'Q2', product, SUM(sales)
FROM Q2_Sales
GROUP BY product
UNION ALL
SELECT 'Q3', product, SUM(sales)
FROM Q3_Sales
GROUP BY product
UNION ALL
SELECT 'Q4', product, SUM(sales)
FROM Q4_Sales
GROUP BY product
ORDER BY product, quarter;
```

---

### **UNION vs UNION ALL - Performance Comparison**

```sql
-- UNION (slower - removes duplicates)
SELECT name FROM Students WHERE age > 20
UNION
SELECT name FROM Students WHERE city = 'Dhaka';
-- Takes more time: scans, sorts, removes duplicates

-- UNION ALL (faster - keeps all)
SELECT name FROM Students WHERE age > 20
UNION ALL
SELECT name FROM Students WHERE city = 'Dhaka';
-- Faster: just combines results
```

**When to use which:**

- Use **UNION** when you need unique results
- Use **UNION ALL** when:
  - You know there are no duplicates
  - You want to keep duplicates
  - Performance is critical

---

### **Advanced UNION Examples:**

**Example: Create a comprehensive contact list**

```sql
-- Combine contacts from multiple sources
SELECT
    name,
    email,
    phone,
    'Customer' AS type
FROM Customers
WHERE email IS NOT NULL
UNION
SELECT
    name,
    email,
    phone,
    'Supplier' AS type
FROM Suppliers
WHERE email IS NOT NULL
UNION
SELECT
    name,
    email,
    phone,
    'Employee' AS type
FROM Employees
WHERE status = 'active'
ORDER BY name;
```

---

**Example: Historical data analysis**

```sql
-- Combine sales from different years for comparison
SELECT
    product_name,
    2023 AS year,
    SUM(quantity) AS total_sold
FROM Sales2023
GROUP BY product_name
UNION ALL
SELECT
    product_name,
    2024 AS year,
    SUM(quantity) AS total_sold
FROM Sales2024
GROUP BY product_name
ORDER BY product_name, year;

-- Result:
-- | product_name | year | total_sold |
-- |--------------|------|------------|
-- | Laptop       | 2023 | 100        |
-- | Laptop       | 2024 | 150        |
-- | Mouse        | 2023 | 500        |
-- | Mouse        | 2024 | 600        |
```

---

### **Common Mistakes with UNION:**

❌ **Wrong - Different number of columns:**

```sql
SELECT name, age FROM Students
UNION
SELECT name FROM Teachers;  -- ERROR: column count mismatch
```

✅ **Correct:**

```sql
SELECT name, age FROM Students
UNION
SELECT name, NULL AS age FROM Teachers;  -- Add NULL for missing column
```

---

❌ **Wrong - Incompatible data types:**

```sql
SELECT name, age FROM Students       -- age is INT
UNION
SELECT name, city FROM Teachers;     -- city is VARCHAR
-- May cause error or unexpected results
```

✅ **Correct - Cast to compatible type:**

```sql
SELECT name, CAST(age AS VARCHAR) AS info FROM Students
UNION
SELECT name, city AS info FROM Teachers;
```

---

Would you like me to continue with **Section 4E: SUBQUERIES** next? This will cover:

- What are subqueries
- Correlated vs Non-correlated subqueries
- Subqueries in WHERE, FROM, and SELECT clauses
- EXISTS and NOT EXISTS
- ANY and ALL operators

Let me know if you need any clarification on GROUP BY, ORDER BY, or UNION operations first!
