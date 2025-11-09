# Update with Aggregation Pipelines

## What it is

MongoDB's **Aggregation Pipeline for Updates** is a powerful feature introduced in **version 4.2**. It allows you to perform **complex updates** by using aggregation expressions inside `updateOne()` or `updateMany()` operations. This means you can modify documents dynamically — calculating new values, applying conditions, and transforming data before saving it.

---

## Why used

1. To **perform advanced updates** without fetching and rewriting documents manually.
2. To **combine aggregation logic with update operations** for cleaner and faster queries.
3. To **manipulate multiple fields at once** using operators like `$set`, `$cond`, and `$multiply`.
4. To **improve performance and consistency** by processing updates directly inside the database.

---

## Example with explanation

### 1. Basic Syntax

```js
db.collection.updateMany(
  <filter>,
  [
    {
      $set: {
        <field>: <expression>
      }
    }
  ]
);
```

**Explanation:**

- `<filter>` → Selects which documents to update.
- `$set` → Defines what fields to update.
- `<expression>` → Uses aggregation operators (like `$multiply`, `$cond`, etc.) to compute new values.

---

### Example 1: Add 10% Bonus to All Salaries

**Collection:**

```js
[
  {
    name: "John Doe",
    salary: 60000,
    department: "Engineering",
    status: "Senior",
  },
  { name: "Jane Smith", salary: 45000, department: "HR", status: "Junior" },
  {
    name: "Alice Johnson",
    salary: 75000,
    department: "Finance",
    status: "Senior",
  },
];
```

**Query:**

```js
db.employees.updateMany({}, [
  {
    $set: {
      salary: { $multiply: ["$salary", 1.1] },
    },
  },
]);
```

**Output:**

```js
[
  {
    name: "John Doe",
    salary: 66000,
    department: "Engineering",
    status: "Senior",
  },
  { name: "Jane Smith", salary: 49500, department: "HR", status: "Junior" },
  {
    name: "Alice Johnson",
    salary: 82500,
    department: "Finance",
    status: "Senior",
  },
];
```

**Explanation:**

- `{}` → Updates all documents.
- `$multiply` → Increases each salary by 10%.
- `$set` → Assigns the computed salary back to the field.

---

### Example 2: Update Status Using `$cond`

We want to set the `status` as **“Senior”** if the salary is ≥ 50,000; otherwise, **“Junior.”**

**Query:**

```js
db.employees.updateMany({}, [
  {
    $set: {
      status: {
        $cond: {
          if: { $gte: ["$salary", 50000] },
          then: "Senior",
          else: "Junior",
        },
      },
    },
  },
]);
```

**Output:**

```js
[
  {
    name: "John Doe",
    salary: 60000,
    department: "Engineering",
    status: "Senior",
  },
  { name: "Jane Smith", salary: 45000, department: "HR", status: "Junior" },
  {
    name: "Alice Johnson",
    salary: 75000,
    department: "Finance",
    status: "Senior",
  },
];
```

**Explanation:**

- `$cond` checks if salary ≥ 50,000.
- `$gte` is a comparison operator (“greater than or equal to”).
- The result sets the `status` accordingly.

---

### Example 3: Update Multiple Fields Together

Here, we’ll update **two fields at once**: increase the salary by 10% and set every employee’s department to “Engineering.”

**Query:**

```js
db.employees.updateMany({}, [
  {
    $set: {
      salary: { $multiply: ["$salary", 1.1] },
    },
  },
  {
    $set: {
      department: "Engineering",
    },
  },
]);
```

**Output:**

```js
[
  {
    name: "John Doe",
    salary: 66000,
    department: "Engineering",
    status: "Senior",
  },
  {
    name: "Jane Smith",
    salary: 49500,
    department: "Engineering",
    status: "Junior",
  },
  {
    name: "Alice Johnson",
    salary: 82500,
    department: "Engineering",
    status: "Senior",
  },
];
```

**Explanation:**

- The first `$set` updates `salary` using `$multiply`.
- The second `$set` modifies the `department` field.
- Multiple `$set` stages can be combined for complex updates.

---

## Notes

- The **aggregation pipeline update** feature is available in **MongoDB 4.2 and above**.
- You can use **aggregation operators** like `$add`, `$divide`, `$concat`, `$substr`, and `$toUpper` inside updates.
- Complex updates can be done in one query — no need for multiple round trips.
- Great for **bulk updates** or **data normalization tasks**.
