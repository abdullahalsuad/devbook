# Aggregation in MongoDB

## What it is

MongoDB Aggregation is a process used to perform **advanced data analysis and transformation** on documents in a collection. It works through an **aggregation pipeline**, where data passes through multiple stages like filtering, grouping, sorting, and reshaping to produce a summarized or computed result.

---

## Why used

1. To **summarize large datasets** (e.g., total users, total sales, average age).
2. To **analyze and transform data** without writing complex queries.
3. To **combine multiple operations** such as filtering, grouping, and sorting in a single pipeline.
4. To perform **real-time analytics** directly within MongoDB.

---

## Example with explanation

### 1. Single-Purpose Aggregation

Used for **simple operations** like counting or getting unique values.

**Common methods:**

- `count()` → Counts all documents in a collection.
- `distinct()` → Finds unique values for a specific field.
- `estimatedDocumentCount()` → Gives an approximate document count.

**Example: Counting users in each city**

```js
db.users.aggregate([{ $group: { _id: "$city", totalUsers: { $sum: 1 } } }]);
```

**Output:**

```js
[
  { _id: "Los Angeles", totalUsers: 1 },
  { _id: "New York", totalUsers: 1 },
  { _id: "Chicago", totalUsers: 1 },
];
```

**Explanation:**

- `$group` groups documents by the `city` field.
- `$sum: 1` counts the total users in each city.

---

### 2. Aggregation Pipeline

The **aggregation pipeline** is a step-by-step process where the output of one stage becomes the input for the next. It allows **complex data manipulation** such as filtering, grouping, projecting, sorting, and limiting.

**Common pipeline stages:**

- `$match` → Filters documents.
- `$group` → Groups documents and performs calculations.
- `$project` → Reshapes or hides fields.
- `$sort` → Sorts results.
- `$limit` → Restricts the number of results.

**Example dataset:**

```js
{
  name: "Alice", age: 30, city: "New York"
}
{
  name: "Bob", age: 35, city: "Los Angeles"
}
{
  name: "Charlie", age: 25, city: "Chicago"
}
```

### `$group` Example

```js
db.users.aggregate([
  { $group: { _id: "$city", averageAge: { $avg: "$age" } } },
]);
```

**Output:**

```js
[
  { _id: "New York", averageAge: 30 },
  { _id: "Chicago", averageAge: 25 },
  { _id: "Los Angeles", averageAge: 35 },
];
```

**Explanation:**

- Groups users by city.
- Calculates average age for each group using `$avg`.

---

### `$project` Example

```js
db.users.aggregate([{ $project: { name: 1, city: 1, _id: 0 } }]);
```

**Output:**

```js
[
  { name: "Alice", city: "New York" },
  { name: "Bob", city: "Los Angeles" },
  { name: "Charlie", city: "Chicago" },
];
```

**Explanation:**

- Includes only `name` and `city` fields.
- Excludes `_id` using `_id: 0`.

---

### `$match` Example

```js
db.users.aggregate([{ $match: { age: { $gt: 30 } } }]);
```

**Output:**

```js
[{ name: "Bob", age: 35, city: "Los Angeles" }];
```

**Explanation:**

- `$match` filters users where age > 30.

---

### `$sort` Example

```js
db.users.aggregate([{ $sort: { age: 1 } }]);
```

**Output:**

```js
[
  { name: "Charlie", age: 25 },
  { name: "Alice", age: 30 },
  { name: "Bob", age: 35 },
];
```

**Explanation:**

- Sorts users by age in ascending order.

---

### `$limit` Example

```js
db.users.aggregate([{ $limit: 2 }]);
```

**Output:**

```js
[
  { name: "Alice", city: "New York" },
  { name: "Bob", city: "Los Angeles" },
];
```

**Explanation:**

- Limits the result to only two documents.

---

## Notes

- Aggregation is faster and more flexible than multiple separate queries.
- You can chain multiple stages for powerful data analysis.
- Common accumulators: `$sum`, `$avg`, `$min`, `$max`, `$push`.

---
