# Domain-Driven Design (DDD)

> **See it in action**: This project includes a complete DDD implementation in the [Rocket Medic system](README.md) - a hospital management domain with patients, doctors, and appointments.

## What is Domain-Driven Design?

Domain-Driven Design is a software development approach introduced by Eric Evans in 2003 that focuses on creating software that models complex business domains. DDD emphasizes collaboration between technical experts and domain experts to create a shared understanding of the problem space and build software that accurately reflects the business reality.

The core philosophy of DDD is that the most critical complexity in software projects is not technical—it's understanding and modeling the business domain itself.

## Why is Domain-Driven Design Used?

DDD is particularly valuable for:

### 1. **Managing Complex Business Logic**

When your application has intricate business rules and workflows, DDD provides patterns and practices to organize and manage this complexity effectively.

### 2. **Improving Communication**

DDD bridges the gap between developers and domain experts by establishing a common language and shared mental models, reducing misunderstandings and misaligned expectations.

### 3. **Creating Maintainable Code**

By modeling the domain explicitly in code, DDD makes the software easier to understand, modify, and extend over time as business requirements evolve.

### 4. **Focusing on Core Business Value**

DDD helps teams identify and prioritize the most important parts of the system (the "core domain") where innovation provides competitive advantage.

### 5. **Building Scalable Systems**

Through concepts like Bounded Contexts, DDD naturally supports microservices architecture and helps manage large, distributed systems.

## What is Ubiquitous Language?

**Ubiquitous Language** is one of the most fundamental concepts in DDD. It's a shared, common language that is used consistently by both developers and domain experts throughout the project.

### Key Characteristics:

- **Shared Vocabulary**: The same terms are used in conversations, documentation, and code
- **Domain-Centric**: Terms come from the business domain, not technical jargon
- **Evolves Over Time**: The language is refined as understanding of the domain deepens
- **Reflected in Code**: Class names, method names, and variable names use terms from the Ubiquitous Language

### Why It Matters:

Without a Ubiquitous Language, developers might call something a "User" while the business calls it a "Customer" or "Member," leading to confusion and errors. The language ensures everyone is literally speaking the same language.

## Simple Example: Online Bookstore

Let's explore how DDD and Ubiquitous Language work in practice with an online bookstore domain.

### Ubiquitous Language Terms:

- **Customer**: A person who browses and purchases books
- **Catalog**: The collection of available books
- **Shopping Cart**: A temporary collection of books a customer intends to purchase
- **Order**: A confirmed purchase with payment and shipping details
- **Inventory**: The stock of physical books available for sale
- **Shipment**: The process of delivering an order to a customer

### Without DDD (Confusing Naming):

```typescript
class User {
  items: any[] = []; // What kind of items?
  total: number = 0;

  add(thing: any): void {
    // Add what?
    this.items.push(thing);
    this.calculate();
  }

  calculate(): void {
    // Calculate what?
    this.total = this.items.reduce((sum, item) => sum + item.price, 0);
  }
}
```

### With DDD and Ubiquitous Language:

```typescript
// Value Objects and Enums
enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal';
  details: any;
}

// Entities
class Book {
  constructor(
    public readonly isbn: string,
    public readonly title: string,
    public readonly author: string,
    public readonly price: number
  ) {}
}

class CartItem {
  constructor(
    public readonly book: Book,
    public readonly quantity: number
  ) {}

  subtotal(): number {
    return this.book.price * this.quantity;
  }
}

class ShoppingCart {
  private items: CartItem[] = [];

  addItem(book: Book, quantity: number): void {
    const cartItem = new CartItem(book, quantity);
    this.items.push(cartItem);
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal(), 0);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}

class Order {
  private status: OrderStatus = OrderStatus.PENDING;
  private readonly totalAmount: number;

  constructor(
    public readonly orderId: string,
    public readonly customer: Customer,
    private readonly items: CartItem[],
    public readonly shippingAddress: ShippingAddress,
    public readonly paymentMethod: PaymentMethod
  ) {
    this.totalAmount = this.calculateTotal();
  }

  static createFromCart(
    customer: Customer,
    cart: ShoppingCart,
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod
  ): Order {
    const orderId = this.generateOrderId();
    const items = cart.getItems();
    return new Order(orderId, customer, items, shippingAddress, paymentMethod);
  }

  private calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal(), 0);
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  confirmPayment(): void {
    this.status = OrderStatus.PAID;
  }

  ship(): void {
    if (this.status !== OrderStatus.PAID) {
      throw new Error('Cannot ship unpaid order');
    }
    this.status = OrderStatus.SHIPPED;
  }

  cancel(): void {
    if (
      this.status === OrderStatus.SHIPPED ||
      this.status === OrderStatus.DELIVERED
    ) {
      throw new Error('Cannot cancel order that has been shipped or delivered');
    }
    this.status = OrderStatus.CANCELLED;
  }

  private static generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

class Customer {
  private shoppingCart: ShoppingCart;

  constructor(
    public readonly customerId: string,
    public readonly name: string,
    public readonly email: string
  ) {
    this.shoppingCart = new ShoppingCart();
  }

  addBookToCart(book: Book, quantity: number): void {
    this.shoppingCart.addItem(book, quantity);
  }

  getShoppingCart(): ShoppingCart {
    return this.shoppingCart;
  }

  placeOrder(
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod
  ): Order {
    if (this.shoppingCart.isEmpty()) {
      throw new Error('Cannot place order with empty cart');
    }

    const order = Order.createFromCart(
      this,
      this.shoppingCart,
      shippingAddress,
      paymentMethod
    );

    this.shoppingCart.clear();
    return order;
  }
}

// Usage Example
const customer = new Customer('CUST-001', 'John Doe', 'john@example.com');

const book1 = new Book(
  '978-0321125215',
  'Domain-Driven Design',
  'Eric Evans',
  59.99
);
const book2 = new Book(
  '978-0134685991',
  'Clean Architecture',
  'Robert Martin',
  44.99
);

customer.addBookToCart(book1, 1);
customer.addBookToCart(book2, 2);

const shippingAddress: ShippingAddress = {
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'USA',
};

const paymentMethod: PaymentMethod = {
  type: 'credit_card',
  details: { last4: '4242' },
};

const order = customer.placeOrder(shippingAddress, paymentMethod);
console.log(
  `Order ${order.orderId} created with total: $${order.getTotalAmount()}`
);
```

### Benefits in This Example:

1. **Clear Intent**: Methods like `add_book_to_cart()` and `place_order()` clearly express business operations
2. **Domain Language**: Terms like `Customer`, `ShoppingCart`, `Order`, and `Book` match how the business talks about the system
3. **Business Rules**: Rules like "cannot place order with empty cart" or "cannot ship unpaid order" are explicitly modeled
4. **Easy Communication**: Developers can discuss code with business stakeholders using the same terminology

## Key Takeaway

Domain-Driven Design is about creating software that speaks the language of the business, making it easier to understand, maintain, and evolve. By establishing a Ubiquitous Language and modeling the domain explicitly, teams can build systems that truly reflect business needs and adapt as those needs change.

## See DDD in Practice: Rocket Medic Implementation

This repository includes a complete DDD implementation of a hospital management system called **Rocket Medic**. It demonstrates all the concepts discussed here:

### Ubiquitous Language in Action

The Rocket Medic system uses domain terms consistently:

- **Patient** - A person receiving medical care (not "User" or "Person")
- **Doctor** - A medical professional providing care (with CRM license)
- **Appointment** - A scheduled meeting between patient and doctor
- **Medical Record** - Patient's health history (diagnoses, treatments, allergies)
- **Working Hours** - Doctor's availability schedule
- **Examination** - Medical tests and procedures

### Real Code Examples

**Entity with Business Logic:**

```javascript
// src/domain/entities/patient.js
export class Patient {
  constructor(
    id,
    identificationDocument,
    name,
    dateOfBirth,
    gender,
    bloodType,
    address, // Value Object
    phoneNumber,
    email,
    emergencyContact // Value Object
  ) {
    this.id = id;
    this.name = name;
    // ... initialization
    this.medicalRecord = new MedicalRecord();
  }

  scheduleAppointment(appointment) {
    if (!(appointment instanceof Appointment)) {
      throw new Error('Invalid appointment');
    }
    this.appointments.push(appointment);
  }

  addAllergy(allergy) {
    this.medicalRecord.addAllergy(allergy);
  }
}
```

**Value Object:**

```javascript
// src/domain/value-objects/address.js
export class Address {
  constructor(street, number, city, state, zipCode) {
    this.street = street;
    this.number = number;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
  }

  equals(otherAddress) {
    return (
      this.street === otherAddress.street &&
      this.number === otherAddress.number &&
      this.city === otherAddress.city &&
      this.state === otherAddress.state &&
      this.zipCode === otherAddress.zipCode
    );
  }
}
```

**Domain Service with Business Rules:**

```javascript
// src/domain/services/doctor-service/doctorAvailabilityService.js
export class DoctorAvailabilityService {
  constructor(doctorService, appointmentRepository) {
    this.doctorService = doctorService;
    this.appointmentRepository = appointmentRepository;
  }

  isDoctorAvailable(doctorId, dateTime) {
    const doctor = this.doctorService.getDoctor(doctorId);

    // Business Rule: Check if within working hours
    if (!this.isWithinWorkingHours(doctor, dateTime)) {
      return false;
    }

    // Business Rule: Check for conflicts
    const existingAppointments =
      this.appointmentRepository.findByDoctor(doctorId);

    return !existingAppointments.some((apt) =>
      this.hasTimeConflict(apt.dateTime, dateTime)
    );
  }
}
```

### Architecture Layers

The implementation follows Hexagonal Architecture:

```
src/
├── domain/              # Business logic (entities, value objects, services)
├── application/         # Use cases (AppointmentService)
├── infrastructure/      # Technical implementations (repositories, notifications)
└── interfaces/         # API controllers and routes
```

### Explore the Implementation

1. **Quick Start**: [QUICK_START.md](QUICK_START.md)
2. **Architecture Details**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. **Domain Model**: [docs/DOMAIN_MODEL.md](docs/DOMAIN_MODEL.md)
4. **API Reference**: [docs/API.md](docs/API.md)
5. **Development Guide**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

Run the example to see DDD in action:

```bash
cd src && node testCase/testHospital.js
```
