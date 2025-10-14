# TypeScript: Type Aliases vs Interfaces

These notes explain how to define the shape of objects in TypeScript using Type Aliases and Interfaces.  
Includes basic types, examples, intersections, extension, and common errors.

---


### What is the difference between type and interface?

One major difference between `type aliases` vs `interfaces` are that `interfaces` are open and `type aliases` are closed. This means you can extend an `interface` by declaring it a second time. In the other case a type cannot be changed outside of its declaration.

---

## 1. `Type Alias`

**What it is:** A way to define a custom type for an object, primitive, union, intersection, or combination.

**Why used:** For objects, unions, intersections, or utility types. Cannot be reopened later.

```ts
//Basic Types Example:
type MyString = string;
type MyNumber = number;
type MyBoolean = boolean;

const name: MyString = "Alice";
const age: MyNumber = 25;
const isAdmin: MyBoolean = true;
```

```ts
// Object Example
type User = {
  id: number;
  name: string;
  isAdmin?: boolean; // optional
};

// Intersection Example
type Person = { name: string };
type Employee = Person & { salary: number };

const user: Employee = { name: "xyz", salary: 10 };
console.log(user); // { name: "xyz", salary: 10 }

// Error example
const wrongUser: Employee = { name: "xyz" }; // ❌ Error: Property 'salary' is missing
```

---

## 2. `Interface`

**What it is:** A way to define object shapes that can be extended or reopened.

**Why used:** Best for objects and models that may need extensions.

```ts
// Basic Interface Example
interface MyUser {
  id: number;
  name: string;
  isAdmin?: boolean;
}

const user1: MyUser = { id: 1, name: "Alice", isAdmin: true };
```

```ts
// Extension Example
interface Person {
  name: string;
}

interface Employee extends Person {
  salary: number;
}

const employee: Employee = { name: "xyz", salary: 5000 };
console.log(employee); // { name: "xyz", salary: 5000 }

// Error example
const wrongEmployee: Employee = { name: "xyz" }; // ❌ Error: Property 'salary' is missing
```

```ts
// Reopening Example
interface Person {
  age?: number;
}

const p: Person = { name: "Alice", age: 25 };
console.log(p); // { name: "Alice", age: 25 }
```

---

- Use `interface` for objects, classes, and models.
- Use `type` for unions, intersections, primitives, and utility types.
