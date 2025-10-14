# TypeScript: Union, Intersection, Type Narrowing, Generics

This note covers advanced TypeScript types for flexibility and type safety.  
Includes union types, intersection types, type narrowing, and generics with examples and error handling.

---

## 1. `Union Types`

**What it is:** A type that allows a variable to hold more than one type using `|`.

**Why used:** When a value can have different types in different situations.

```ts
let value: string | number;

value = "Hello";
console.log(value); // Hello

value = 42;
console.log(value); // 42

function printId(id: string | number) {
  console.log("ID is:", id);
}

printId(101);
printId("A-55");

// Error example
value = true; // ❌ Error: Type 'boolean' is not assignable to type 'string | number'
```

---

## 2. `Intersection Types`

**What it is:** Combines multiple types into one. The resulting type must satisfy all combined types.

**Why used:** To merge properties from multiple types into a single object type.

```ts
type Person = { name: string };
type Employee = { salary: number };
type Staff = Person & Employee;

const staff1: Staff = { name: "John", salary: 5000 };
console.log(staff1);

// Error example
const wrongStaff: Staff = { name: "John" }; // ❌ Error: Property 'salary' is missing
```

---

## 3. `Type Narrowing`

**What it is:** Refining a union type to a more specific type within a conditional block.

**Why used:** To safely access properties or methods that exist only on one type.

```ts
function showData(data: string | number) {
  if (typeof data === "string") {
    console.log("String length:", data.length);
  } else {
    console.log("Number fixed:", data.toFixed(2));
  }
}

showData("hello");
showData(12.3456);

// Error example
console.log(data.length); // ❌ Error: Property 'length' does not exist on type 'number'
```

---

## 4. `Generics`

**What it is:** Type placeholders that allow functions, classes, or interfaces to work with any type while staying type-safe.

**Why used:** To create reusable and flexible code without losing type safety.

```ts
function wrapValue<T>(value: T) {
  return { value };
}

console.log(wrapValue(10)); // { value: 10 }
console.log(wrapValue("TypeScript")); // { value: "TypeScript" }
console.log(wrapValue(true)); // { value: true }

function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log(getFirst([1, 2, 3])); // 1
console.log(getFirst(["a", "b", "c"])); // "a"

// Error example
getFirst(123); // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'any[]'
```

---

## 5. `Interface + Generics`

**What it is:** Generics can be used inside interfaces to create flexible type-safe structures.

**Why used:** Useful for API responses or data containers where the type of data may change.

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const userResponse: ApiResponse<string[]> = {
  success: true,
  data: ["John", "Alice"],
};

console.log(userResponse);

// Error example
const wrongResponse: ApiResponse<number> = { success: true, data: ["John"] }; // ❌ Error
```
