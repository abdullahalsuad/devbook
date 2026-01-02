# Database Fundamentals

Before learning PostgreSQL, we must clearly understand **what a Database is**, how it is different from **DBMS**, and what **RDBMS** means. These concepts are the foundation of everything that comes later.

---

## What is a Database (DB)?

### What

A **Database** is an **organized collection of data** stored in a structured way so it can be **easily accessed, managed, and updated**.

In simple words:

> A database is where your application’s data lives.

### Why

We use databases because:

- Data must be **stored permanently**
- Data must be **retrieved fast**
- Data must be **safe and consistent**
- Multiple users may access data at the same time

### Where it is used

Almost everywhere:

- User accounts (email, password)
- Orders in an e-commerce app
- Messages in a chat app
- Bank transactions
- School / hospital records

### Example

Think of a database like an **Excel file**, but:

- Much faster
- Can handle millions of rows
- Multiple people can use it together
- Much more secure

Example data inside a database:

| id  | name  | email          |
| --- | ----- | -------------- |
| 1   | Rahim | rahim@mail.com |
| 2   | Karim | karim@mail.com |

---

## Database vs DBMS

### What is DBMS?

**DBMS (Database Management System)** is **software** that allows us to:

- Create databases
- Store data
- Read data
- Update data
- Delete data
- Control access and security

> Database = Data  
> DBMS = Software that manages the data

---

### Database vs DBMS (Comparison)

| Feature | Database           | DBMS                             |
| ------- | ------------------ | -------------------------------- |
| Meaning | Collection of data | Software to manage data          |
| Type    | Data               | Application / software           |
| Purpose | Store information  | Control, access, and manage data |
| Example | User table         | PostgreSQL, MySQL, Oracle        |

---

### Real-life Analogy

**Library example**:

- Books = **Database**
- Librarian + rules system = **DBMS**

Without a DBMS, the database is just raw data with no control.

---

## What is RDBMS?

### What

**RDBMS (Relational Database Management System)** is a **type of DBMS** where:

- Data is stored in **tables**
- Tables are related to each other using **keys**
- Data follows strict rules (schema)

PostgreSQL is an **RDBMS**.

---

### Why RDBMS is important

RDBMS provides:

- **Relationships** between data
- **Data integrity**
- **Less duplication**
- **Powerful queries using SQL**

---

### How RDBMS works

In RDBMS:

- Data → stored in **tables**
- Tables → connected using **Primary Key & Foreign Key**
- SQL → used to interact with data

Example:

**Users table**
| id (PK) | name |
|--------|------|
| 1 | Rahim |

**Orders table**
| id | user_id (FK) | product |
|----|-------------|--------|
| 101 | 1 | Laptop |

Here:

- `id` in Users = **Primary Key**
- `user_id` in Orders = **Foreign Key**
- This creates a **relationship**

---

### RDBMS vs Non-Relational (NoSQL) (Quick Idea)

| Feature   | RDBMS      | NoSQL           |
| --------- | ---------- | --------------- |
| Structure | Tables     | JSON / Document |
| Schema    | Fixed      | Flexible        |
| Relations | Strong     | Weak / none     |
| Example   | PostgreSQL | MongoDB         |

---
