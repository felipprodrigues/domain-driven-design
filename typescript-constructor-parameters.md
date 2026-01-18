# TypeScript Constructor Parameters with Access Modifiers

> **Note**: The [Rocket Medic implementation](README.md) uses JavaScript (not TypeScript) for educational simplicity. This document explains TypeScript features that provide compile-time safety for similar patterns. See the comparison section below.

## Overview

TypeScript offers a powerful shorthand feature called **Parameter Properties** that allows you to declare and initialize class properties directly in the constructor parameters using access modifiers (`public`, `private`, `protected`) and/or the `readonly` modifier.

This is a unique TypeScript feature that doesn't exist in vanilla JavaScript and significantly reduces boilerplate code.

## Basic Syntax

### Traditional Way (Verbose)

```typescript
class Book {
  isbn: string;
  title: string;
  price: number;

  constructor(isbn: string, title: string, price: number) {
    this.isbn = isbn;
    this.title = title;
    this.price = price;
  }
}
```

### TypeScript Shorthand (Parameter Properties)

```typescript
class Book {
  constructor(
    public isbn: string,
    public title: string,
    public price: number
  ) {}
}
```

**Both approaches create exactly the same class**, but the shorthand is much more concise!

## Access Modifiers Explained

### `public` - Accessible Everywhere

Properties marked as `public` can be accessed and modified from anywhere: inside the class, in subclasses, and from external code.

```typescript
class Customer {
  constructor(
    public customerId: string,
    public name: string,
    public email: string
  ) {}
}

const customer = new Customer('C001', 'John Doe', 'john@example.com');

// ✅ Can access and modify
console.log(customer.name); // "John Doe"
customer.email = 'newemail@example.com'; // ✅ Allowed
```

### `private` - Accessible Only Inside the Class

Properties marked as `private` can only be accessed and modified from within the class itself. They are not accessible from outside or in subclasses.

```typescript
class BankAccount {
  constructor(
    public accountNumber: string,
    private balance: number // Hidden from outside
  ) {}

  deposit(amount: number): void {
    this.balance += amount; // ✅ Can access inside class
  }

  getBalance(): number {
    return this.balance; // ✅ Can access inside class
  }
}

const account = new BankAccount('ACC123', 1000);

// ✅ Allowed
console.log(account.accountNumber); // "ACC123"
account.deposit(500);
console.log(account.getBalance()); // 1500

// ❌ ERROR: Property 'balance' is private
// console.log(account.balance);
// account.balance = 5000;
```

### `protected` - Accessible in Class and Subclasses

Properties marked as `protected` can be accessed within the class and any subclasses, but not from external code.

```typescript
class Animal {
  constructor(
    protected name: string,
    protected age: number
  ) {}

  describe(): string {
    return `${this.name} is ${this.age} years old`; // ✅ Can access
  }
}

class Dog extends Animal {
  constructor(
    name: string,
    age: number,
    public breed: string
  ) {
    super(name, age);
  }

  bark(): string {
    return `${this.name} says Woof!`; // ✅ Can access in subclass
  }
}

const dog = new Dog('Max', 3, 'Golden Retriever');
console.log(dog.breed); // ✅ "Golden Retriever"
console.log(dog.describe()); // ✅ "Max is 3 years old"
console.log(dog.bark()); // ✅ "Max says Woof!"

// ❌ ERROR: Property 'name' is protected
// console.log(dog.name);
```

## The `readonly` Modifier

The `readonly` modifier makes a property immutable after it's initialized. It can only be assigned a value in the constructor.

### Using `readonly` Alone

```typescript
class Book {
  readonly isbn: string;
  title: string;

  constructor(isbn: string, title: string) {
    this.isbn = isbn;
    this.title = title;
  }
}

const book = new Book('978-0321125215', 'Domain-Driven Design');

book.title = 'New Title'; // ✅ Allowed
// book.isbn = "978-1234567890";  // ❌ ERROR: Cannot assign to 'isbn' because it is a read-only property
```

### Combining `readonly` with Access Modifiers

You can combine `readonly` with `public`, `private`, or `protected`:

```typescript
class Order {
  constructor(
    public readonly orderId: string, // ✅ Public and immutable
    private readonly createdAt: Date, // ✅ Private and immutable
    public customerName: string // ✅ Public and mutable
  ) {}

  getCreatedAt(): Date {
    return this.createdAt; // ✅ Can access private property inside class
  }

  // ❌ Can't modify readonly properties even inside the class
  // changeOrderId(newId: string): void {
  //   this.orderId = newId;  // ERROR!
  // }
}

const order = new Order('ORD-001', new Date(), 'Jane Smith');

console.log(order.orderId); // ✅ "ORD-001"
console.log(order.customerName); // ✅ "Jane Smith"

order.customerName = 'John Smith'; // ✅ Allowed (public and mutable)

// ❌ ERROR: Cannot assign to 'orderId' because it is a read-only property
// order.orderId = "ORD-002";

// ❌ ERROR: Property 'createdAt' is private
// console.log(order.createdAt);
```

## Practical Examples

### Example 1: User with Private Password

```typescript
class User {
  constructor(
    public readonly userId: string,
    public username: string,
    private passwordHash: string
  ) {}

  verifyPassword(password: string): boolean {
    // In real app, you'd use bcrypt or similar
    return this.passwordHash === password;
  }

  changePassword(oldPassword: string, newPassword: string): void {
    if (this.verifyPassword(oldPassword)) {
      this.passwordHash = newPassword; // ✅ Can modify private property inside class
    } else {
      throw new Error('Invalid old password');
    }
  }
}

const user = new User('U001', 'johndoe', 'hashed_password_123');

console.log(user.userId); // ✅ "U001"
console.log(user.username); // ✅ "johndoe"

user.username = 'john_doe'; // ✅ Can change username

// ❌ Cannot access password from outside
// console.log(user.passwordHash);  // ERROR!

// ❌ Cannot change userId (readonly)
// user.userId = "U002";  // ERROR!

// ✅ Must use public method to change password
user.changePassword('hashed_password_123', 'new_hashed_password');
```

### Example 2: Shopping Cart with Encapsulation

```typescript
class ShoppingCart {
  private items: CartItem[] = []; // Traditional private property

  constructor(
    public readonly cartId: string,
    public readonly customerId: string
  ) {}

  addItem(item: CartItem): void {
    this.items.push(item); // ✅ Can modify private property inside class
  }

  getItems(): CartItem[] {
    return [...this.items]; // Return a copy to prevent external modification
  }

  getTotalPrice(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  clear(): void {
    this.items = [];
  }
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const cart = new ShoppingCart('CART-001', 'CUST-123');

cart.addItem({ productId: 'P1', name: 'Book', price: 29.99, quantity: 2 });
cart.addItem({ productId: 'P2', name: 'Pen', price: 5.99, quantity: 5 });

console.log(cart.getTotalPrice()); // 89.93

// ✅ Can access readonly public properties
console.log(cart.cartId); // "CART-001"
console.log(cart.customerId); // "CUST-123"

// ❌ Cannot modify readonly properties
// cart.cartId = "CART-002";  // ERROR!

// ❌ Cannot access private items directly
// console.log(cart.items);  // ERROR!

// ✅ Must use public methods to interact with private data
const items = cart.getItems();
console.log(items.length); // 2
```

### Example 3: Product with Mixed Modifiers

```typescript
class Product {
  private inventoryCount: number = 0; // Traditional property

  constructor(
    public readonly productId: string,
    public name: string,
    public price: number,
    private readonly costPrice: number // Private readonly - can't be changed or accessed outside
  ) {}

  // Public method to safely modify private property
  addStock(quantity: number): void {
    this.inventoryCount += quantity;
  }

  // Public method to read private property
  getInventoryCount(): number {
    return this.inventoryCount;
  }

  // Calculate profit margin using private costPrice
  getProfitMargin(): number {
    return ((this.price - this.costPrice) / this.price) * 100;
  }
}

const product = new Product('P001', 'Laptop', 1200, 800);

// ✅ Public properties accessible
console.log(product.name); // "Laptop"
console.log(product.price); // 1200

// ✅ Can modify public mutable properties
product.price = 1100;

// ❌ Cannot modify readonly
// product.productId = "P002";  // ERROR!

// ❌ Cannot access private
// console.log(product.costPrice);  // ERROR!

// ✅ Use public methods to interact with private data
product.addStock(50);
console.log(product.getInventoryCount()); // 50
console.log(product.getProfitMargin()); // 27.27%
```

## Quick Reference

| Modifier           | Accessible in Class | Accessible in Subclass | Accessible Outside | Can be Modified            |
| ------------------ | ------------------- | ---------------------- | ------------------ | -------------------------- |
| `public`           | ✅                  | ✅                     | ✅                 | ✅                         |
| `private`          | ✅                  | ❌                     | ❌                 | ✅ (inside class)          |
| `protected`        | ✅                  | ✅                     | ❌                 | ✅ (inside class/subclass) |
| `readonly`         | ✅ (read)           | ✅ (read)              | ✅ (read)          | ❌ (only in constructor)   |
| `public readonly`  | ✅ (read)           | ✅ (read)              | ✅ (read)          | ❌                         |
| `private readonly` | ✅ (read)           | ❌                     | ❌                 | ❌                         |

## Best Practices

1. **Use `readonly` for immutable identifiers**: IDs, timestamps, and other values that shouldn't change
2. **Use `private` for internal state**: Data that should only be modified through controlled methods
3. **Use `public` sparingly**: Only expose what needs to be accessible from outside
4. **Combine modifiers wisely**: `public readonly` for accessible but immutable data, `private` for encapsulated mutable state
5. **Provide methods for controlled access**: Use getter methods for private properties that need to be read, and setter methods for controlled modifications

## Key Takeaway

TypeScript's parameter properties with access modifiers and `readonly` provide a powerful way to:

- Write less boilerplate code
- Enforce encapsulation and data hiding
- Prevent unintended modifications
- Create cleaner, more maintainable class definitions

This feature is especially valuable in Domain-Driven Design where proper encapsulation of entity and value object properties is crucial for maintaining invariants and business rules.

## Related to Rocket Medic Implementation

The [Rocket Medic implementation](README.md) in this repository uses JavaScript for educational simplicity. While JavaScript doesn't have TypeScript's parameter properties or compile-time access modifiers, the same encapsulation principles apply using conventions and ES2022 private fields (`#field`).

**See also:**

- [Domain Model Guide](docs/DOMAIN_MODEL.md) - Entities and Value Objects
- [Architecture Guide](docs/ARCHITECTURE.md) - Project structure
- [DDD Concepts](domain-driven-design-explained.md) - Core principles
