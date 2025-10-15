# TypeScript: Type Guards, Advanced Generics & never Type

## 1. Type Guards & Custom Type Guards

**What it is:** Runtime checks that narrow down union types.

**Why used:** To safely access properties/methods based on actual type.

### Built-in Type Guards (`typeof`, `in`, `instanceof`)

```ts
function logValue(value: string | number | { message: string }) {
  if (typeof value === "string") {
    console.log("String:", value.toUpperCase());
  } else if (typeof value === "number") {
    console.log("Number:", value.toFixed(2));
  } else if ("message" in value) {
    console.log("Object message:", value.message);
  }
}

logValue("hello");
logValue(12.3456);
logValue({ message: "Hi" });

// Error example
// logValue(true); // ❌ Error: boolean not allowed
```

### Custom Type Guard (`is`)

```ts
type Cat = { type: "cat"; meow: () => void };
type Dog = { type: "dog"; bark: () => void };

function isDog(animal: Cat | Dog): animal is Dog {
  return animal.type === "dog";
}

function makeSound(animal: Cat | Dog) {
  if (isDog(animal)) {
    animal.bark();
  } else {
    animal.meow();
  }
}

makeSound({ type: "dog", bark: () => console.log("Woof!") });
makeSound({ type: "cat", meow: () => console.log("Meow!") });

// Error example
// makeSound({ type: "bird" }); // ❌ Error: missing meow or bark
```

## 2. Advanced Generics (Constraints & Default Types)

### Generic Constraints (`extends`)

**What it is:** Restrict allowed types.

**Why used:** Prevent invalid types inside generics.

```ts
function getLength<T extends { length: number }>(item: T) {
  return item.length;
}

console.log(getLength("Hello"));
console.log(getLength([1, 2, 3]));
// getLength(123); // ❌ Error: number has no length
```

### Default Generic Type

**What it is:** Default type if none is given.
**Why used:** Cleaner API usability.

```ts
function createBox<T = string>(value: T) {
  return { value };
}

console.log(createBox("hello"));
console.log(createBox(100));
```

### Generic Interface with Constraint

```ts
interface ApiResponse<T extends object = { message: string }> {
  status: number;
  data: T;
}

const res1: ApiResponse = { status: 200, data: { message: "OK" } };
const res2: ApiResponse<{ user: string }> = {
  status: 200,
  data: { user: "John" },
};

// Error example
const bad: ApiResponse<string> = {
  status: 500,
  data: "Error",
}; // ❌ must be object
```

## 3. The `never` Type

**What it is:** Type for values that should never happen.

**Why used:** Used with exhaustiveness checks and error functions.

### Function that never returns

```ts
function fail(msg: string): never {
  throw new Error(msg);
}

fail("Something went wrong");
```

### Exhaustive Type Checking

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

console.log(area({ kind: "circle", radius: 10 }));
console.log(area({ kind: "square", size: 5 }));
```
