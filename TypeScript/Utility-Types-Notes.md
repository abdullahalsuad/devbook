# TypeScript : Utility Types Notes

These notes cover common TypeScript utility types and operators. Each example includes a human-readable example and an error example.

---

## 1. `Partial<T>`

**What it is:** `Partial<T>` Makes all properties optional.

**Why used:** When updating only some properties of an object.

```ts
type User = { id: number; name: string; email: string };

function updateUser(user: User, updates: Partial<User>) {
  return { ...user, ...updates };
}

const user1: User = {
  id: 1,
  name: "John",
  email: "john@mail.com",
};

const updated = updateUser(user1, { name: "Johnny" });

console.log(updated); // { id: 1, name: 'Johnny', email: 'john@mail.com' }

// Error example
updateUser(user1, { username: "newUser" }); // ❌ Error
```

## 2. `Required<T>`

**What it is:** `Required<T>` Makes all optional properties required.

**Why used:** Ensure all fields exist before usage.

```ts
type Person = { name?: string; age?: number };

const p1: Required<Person> = { name: "Alice", age: 25 };
console.log(p1);

// Error example
const p2: Required<Person> = { name: "Bob" }; // ❌ Error
```

## 3. `Readonly<T>`

**What it is:** `Readonly<T>` Prevents modification of properties after creation.

**Why used:** Useful for immutable objects.

```ts
type Book = { title: string };

const b1: Readonly<Book> = { title: "TS Guide" };
// b1.title = "New"; // ❌ Error
console.log(b1);
```

## 4. `Pick<T, K>`

**What it is:** `Pick<T, K>` Selects specific properties from a type.

**Why used:** To create a subset type.

```ts
type UserPreview = Pick<User, "id" | "name">;

const preview: UserPreview = { id: 1, name: "John" };
console.log(preview);

// Error example
const wrongPreview: UserPreview = {
  id: 1,
  name: "John",
  email: "a@mail.com",
}; // ❌ Error
```

---

## 5. `Omit<T, K>`

**What it is:** `Omit<T, K>` Removes specific properties from a type.

**Why used:** To create a type without certain fields.

```ts
type UserInfo = Omit<User, "email">;

const info: UserInfo = { id: 2, name: "Alice" };
console.log(info);

// Error example
const wrongInfo: UserInfo = {
  id: 2,
  name: "Alice",
  email: "a@mail.com",
}; // ❌ Error
```

## 6. `Record<K, T>`

**What it is:** `Record<K, T>` Creates an object type with keys of type K and values of type T.

**Why used:** For mapping keys to values in a type-safe way.

```ts
type Scores = Record<string, number>;

const scoreBoard: Scores = { alice: 90, bob: 85 };
console.log(scoreBoard);

// Error example
const wrongScoreBoard: Scores = {
  alice: "high",
}; // ❌ Error
```

---

## 7. `ReturnType<T>`

**What it is:** `ReturnType<T>` Gets the return type of a function.

**Why used:** Useful when you want a type based on function output.

```ts
function getAge() {
  return 25;
}

type AgeType = ReturnType<typeof getAge>;
const age: AgeType = 30;
console.log(age);

// Error example
const wrongAge: AgeType = "30"; // ❌ Error
```

## 8. `keyof`

**What it is:** `keyof` Returns the keys of a type as a union type.

**Why used:** For type-safe access to object keys.

```ts
type UserKeys = keyof User; // "id" | "name" | "email"

let key: UserKeys = "name";
console.log(key);

// Error example
let wrongKey: UserKeys = "username"; // ❌ Error
```

---

## 9. `typeof`

**What it is:** `typeof` Gets the type of a variable or object.

**Why used:** Avoid repeating types, get type from value.

```ts
const user = { id: 1, name: "Alice" };
type UserType = typeof user;

const newUser: UserType = {
  id: 2,
  name: "Bob",
};
console.log(newUser);

// Error example
const wrongUser: UserType = {
  id: 3,
  username: "Charlie",
}; // ❌ Error
```
