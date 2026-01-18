# Understanding Domain in Domain-Driven Design

## What is a Domain?

In software development, a **Domain** refers to the sphere of knowledge, activity, or business that your application is designed to address. It encompasses all the business logic, rules, processes, and terminology that define how a particular area of business operates.

Think of the domain as **the problem space** your software is trying to solve—the real-world business context that drives the need for the application.

## Simple Definition

> **Domain = The specific business or subject area that your software models and supports**

## Examples of Domains

### E-Commerce Domain

- **Knowledge Areas**: Product catalog, inventory, shopping cart, orders, payments, shipping, customer accounts
- **Business Rules**: Discount calculations, tax rules, stock management, return policies
- **Key Concepts**: Customer, Product, Order, Payment, Shipment

### Healthcare Domain

- **Knowledge Areas**: Patient records, appointments, diagnoses, treatments, prescriptions, billing
- **Business Rules**: Privacy regulations (HIPAA), prescription validations, appointment scheduling rules
- **Key Concepts**: Patient, Doctor, Appointment, Diagnosis, Prescription, Medical Record

### Banking Domain

- **Knowledge Areas**: Accounts, transactions, loans, interest rates, credit cards, fraud detection
- **Business Rules**: Transaction limits, interest calculations, compliance regulations, risk assessment
- **Key Concepts**: Account, Transaction, Balance, Interest, Loan, Customer

### Airline Reservation Domain

- **Knowledge Areas**: Flights, bookings, seats, pricing, check-in, loyalty programs
- **Business Rules**: Overbooking policies, fare classes, baggage allowances, cancellation fees
- **Key Concepts**: Flight, Booking, Passenger, Seat, Ticket, Fare

## Why Understanding the Domain Matters

### 1. **Alignment with Business Needs**

Software that accurately models the domain solves real business problems effectively. Misunderstanding the domain leads to solutions that don't fit the actual needs.

### 2. **Better Communication**

When developers understand the domain deeply, they can communicate more effectively with domain experts (business stakeholders, subject matter experts) using shared terminology.

### 3. **More Maintainable Code**

Code that reflects domain concepts is easier to understand and modify as business requirements evolve.

### 4. **Competitive Advantage**

Deep domain knowledge allows you to build features that truly differentiate your product and provide business value.

## Domain vs Technical Concerns

It's important to distinguish between **domain logic** and **technical concerns**:

### Domain Logic (Business Logic)

- Rules for calculating order totals
- Validation of business rules (e.g., "customers can't place orders with empty carts")
- Workflow for processing a payment
- Determining if a patient is eligible for a specific treatment

### Technical Concerns (Infrastructure)

- Database connections and queries
- HTTP request/response handling
- File storage and retrieval
- Logging and monitoring
- Authentication mechanisms (JWT, OAuth)

**DDD principle**: Keep domain logic separate from technical infrastructure to maintain clarity and flexibility.

## Domain Isolation

**Domain Isolation** is the practice of keeping domain logic independent and separated from external concerns like infrastructure, frameworks, and UI. This principle ensures that your business logic remains pure, testable, and focused on solving business problems.

### What is Domain Isolation?

Domain isolation means that your domain code (entities, value objects, aggregates, domain services) should:

- Have **no dependencies** on external frameworks or libraries
- Not know about databases, APIs, or UI components
- Focus purely on business rules and logic
- Be testable without requiring infrastructure setup

Think of it as creating a protective boundary around your business logic.

### Benefits of Domain Isolation

#### 1. **Business Focus**

When domain code is isolated, developers can focus entirely on modeling business behavior without worrying about technical details.

**Without Domain Isolation (Mixed Concerns):**

```typescript
// ❌ Domain logic mixed with database code
class Order {
  async calculateTotal(dbConnection: DatabaseConnection): Promise<number> {
    // Database query in domain logic!
    const items = await dbConnection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [this.orderId]
    );

    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    // Save to database in domain logic!
    await dbConnection.query('UPDATE orders SET total = ? WHERE id = ?', [
      total,
      this.orderId,
    ]);

    return total;
  }
}
```

**With Domain Isolation (Pure Business Logic):**

```typescript
// ✅ Pure domain logic - focused only on business rules
class Order {
  private items: OrderItem[] = [];

  constructor(
    public readonly orderId: string,
    public readonly customerId: string
  ) {}

  addItem(product: Product, quantity: number): void {
    // Business rule: validate quantity
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const item = new OrderItem(product, quantity);
    this.items.push(item);
  }

  calculateTotal(): number {
    // Pure calculation - no external dependencies
    return this.items.reduce((sum, item) => sum + item.subtotal(), 0);
  }

  canApplyDiscount(discount: Discount): boolean {
    // Business rule: minimum order for discount
    return this.calculateTotal() >= discount.minimumAmount;
  }
}

class OrderItem {
  constructor(
    public readonly product: Product,
    public readonly quantity: number
  ) {}

  subtotal(): number {
    return this.product.price * this.quantity;
  }
}
```

**Key Difference**: The isolated version focuses purely on **what** the business does, not **how** data is stored or retrieved.

#### 2. **Better Maintainability**

Isolated domain code is easier to understand, test, and modify because it has fewer dependencies and responsibilities.

**Example: Easy to Test**

```typescript
// ✅ No database or framework needed for testing
describe('Order', () => {
  it('should calculate total correctly', () => {
    const order = new Order('ORD-001', 'CUST-001');
    const product1 = new Product('P1', 'Book', 29.99);
    const product2 = new Product('P2', 'Pen', 5.99);

    order.addItem(product1, 2); // 59.98
    order.addItem(product2, 3); // 17.97

    expect(order.calculateTotal()).toBe(77.95);
  });

  it('should not allow negative quantities', () => {
    const order = new Order('ORD-001', 'CUST-001');
    const product = new Product('P1', 'Book', 29.99);

    expect(() => order.addItem(product, -1)).toThrow(
      'Quantity must be positive'
    );
  });
});
```

**Benefits for Maintainability:**

- **Easy to understand**: No technical clutter obscuring business rules
- **Easy to test**: No mocking of databases or external services needed
- **Easy to change**: Business rule changes don't affect infrastructure code
- **Easy to debug**: Pure functions are deterministic and predictable

#### 3. **Code Reuse Promotion**

When domain logic is isolated, it becomes portable and reusable across different contexts without modification.

**Example: Reusable Across Different Interfaces**

```typescript
// Core domain logic (isolated)
class PricingService {
  calculateDiscountedPrice(
    originalPrice: number,
    customerType: CustomerType,
    quantity: number
  ): number {
    let discount = 0;

    // Business rules for discounts
    if (customerType === CustomerType.PREMIUM) {
      discount = 0.15; // 15% for premium
    } else if (customerType === CustomerType.REGULAR) {
      discount = 0.05; // 5% for regular
    }

    // Bulk discount
    if (quantity >= 10) {
      discount += 0.1; // Additional 10% for bulk
    }

    return originalPrice * (1 - discount);
  }
}

enum CustomerType {
  GUEST = 'guest',
  REGULAR = 'regular',
  PREMIUM = 'premium',
}
```

**This same domain logic can be reused in:**

1. **Web API:**

```typescript
// Express.js REST API
app.post('/api/calculate-price', (req, res) => {
  const pricingService = new PricingService();
  const finalPrice = pricingService.calculateDiscountedPrice(
    req.body.price,
    req.body.customerType,
    req.body.quantity
  );
  res.json({ finalPrice });
});
```

2. **Command Line Tool:**

```typescript
// CLI application
const pricingService = new PricingService();
const price = parseFloat(process.argv[2]);
const customerType = process.argv[3] as CustomerType;
const quantity = parseInt(process.argv[4]);

const finalPrice = pricingService.calculateDiscountedPrice(
  price,
  customerType,
  quantity
);
console.log(`Final price: $${finalPrice}`);
```

3. **Mobile App (React Native):**

```typescript
// Mobile app component
function PriceCalculator() {
  const pricingService = new PricingService();

  const calculatePrice = () => {
    const finalPrice = pricingService.calculateDiscountedPrice(
      basePrice,
      userProfile.customerType,
      selectedQuantity
    );
    setDisplayPrice(finalPrice);
  };

  // ... UI code
}
```

4. **Batch Processing:**

```typescript
// Background job processing orders
async function processBulkOrders(orders: Order[]) {
  const pricingService = new PricingService();

  for (const order of orders) {
    const finalPrice = pricingService.calculateDiscountedPrice(
      order.basePrice,
      order.customer.type,
      order.quantity
    );
    await saveOrderWithPrice(order.id, finalPrice);
  }
}
```

**Key Advantage**: Write the business logic once, use it everywhere. No duplication, consistent behavior across all platforms.

### Layered Architecture Supporting Domain Isolation

```
┌─────────────────────────────────────┐
│     Presentation Layer (UI)          │  ← User interfaces, APIs
│  (Web, Mobile, CLI, GraphQL, etc.)  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Application Layer               │  ← Use cases, orchestration
│   (Commands, Queries, Handlers)     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    ⭐ Domain Layer (ISOLATED) ⭐     │  ← Pure business logic
│  (Entities, Value Objects, Rules)   │     NO external dependencies
└─────────────────────────────────────┘
              ↑
┌─────────────────────────────────────┐
│    Infrastructure Layer              │  ← Database, APIs, frameworks
│  (Repositories, External Services)  │
└─────────────────────────────────────┘
```

### Best Practices for Domain Isolation

1. **Keep domain entities framework-agnostic**: No decorators or annotations from ORMs
2. **Use dependency injection**: Let infrastructure depend on domain, not vice versa
3. **Define interfaces in domain layer**: Infrastructure implements them
4. **No technical exceptions in domain**: Throw domain-specific exceptions
5. **Pure functions where possible**: Easier to test and reason about

### Summary of Domain Isolation Benefits

| Aspect                 | Without Isolation             | With Isolation        |
| ---------------------- | ----------------------------- | --------------------- |
| **Business Focus**     | Mixed with technical details  | Pure business logic   |
| **Testing**            | Requires database/mocks       | Simple unit tests     |
| **Maintainability**    | Hard to change                | Easy to modify        |
| **Reusability**        | Tied to specific framework    | Works anywhere        |
| **Understanding**      | Complex, intertwined          | Clear, focused        |
| **Technology Changes** | Risky, affects business logic | Safe, isolated impact |

## Core Domain vs Subdomains

In complex systems, the domain is often divided into smaller parts:

### Core Domain

The **most important and unique** part of your business that provides competitive advantage. This is where you should invest the most effort and create the most sophisticated models.

**Example - E-Commerce Platform:**

- **Core Domain**: Personalized recommendation engine (your competitive differentiator)

### Supporting Subdomains

Important for the business but not differentiating. These support the core domain.

**Example - E-Commerce Platform:**

- **Supporting Subdomain**: Inventory management, order processing

### Generic Subdomains

Common functionality that could be bought or uses standard solutions.

**Example - E-Commerce Platform:**

- **Generic Subdomain**: User authentication, email notifications, payment processing (using Stripe/PayPal)

## Domain Model

A **Domain Model** is a conceptual representation of the domain that includes:

- **Entities**: Objects with unique identity (Customer, Order, Product)
- **Value Objects**: Objects defined by their attributes (Address, Money, DateRange)
- **Aggregates**: Clusters of related entities and value objects treated as a unit
- **Services**: Operations that don't naturally fit in entities or value objects
- **Domain Events**: Significant occurrences in the domain (OrderPlaced, PaymentReceived)

### Example: Library Domain Model

```typescript
// Entity - Has unique identity
class Book {
  constructor(
    public readonly isbn: string, // Unique identifier
    public title: string,
    public author: string,
    private availableCopies: number
  ) {}

  checkout(): void {
    if (this.availableCopies <= 0) {
      throw new Error('No copies available for checkout');
    }
    this.availableCopies--;
  }

  returnCopy(): void {
    this.availableCopies++;
  }

  isAvailable(): boolean {
    return this.availableCopies > 0;
  }
}

// Value Object - Defined by its values, no unique identity
class LibraryMember {
  constructor(
    public readonly memberId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly membershipType: MembershipType
  ) {}

  canBorrowBooks(): boolean {
    return this.membershipType !== MembershipType.SUSPENDED;
  }
}

enum MembershipType {
  REGULAR = 'regular',
  PREMIUM = 'premium',
  SUSPENDED = 'suspended',
}

// Aggregate - Manages book loans
class BookLoan {
  constructor(
    public readonly loanId: string,
    public readonly book: Book,
    public readonly member: LibraryMember,
    public readonly dueDate: Date,
    private returned: boolean = false
  ) {}

  markAsReturned(): void {
    if (this.returned) {
      throw new Error('Book already returned');
    }
    this.returned = false;
    this.book.returnCopy();
  }

  isOverdue(): boolean {
    return !this.returned && new Date() > this.dueDate;
  }

  calculateLateFee(): number {
    if (!this.isOverdue()) return 0;

    const daysLate = Math.floor(
      (new Date().getTime() - this.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysLate * 0.5; // $0.50 per day
  }
}

// Domain Service - Operation involving multiple domain objects
class BookLoanService {
  createLoan(
    book: Book,
    member: LibraryMember,
    durationDays: number
  ): BookLoan {
    if (!member.canBorrowBooks()) {
      throw new Error('Member cannot borrow books');
    }

    if (!book.isAvailable()) {
      throw new Error('Book is not available');
    }

    book.checkout();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + durationDays);

    const loanId = this.generateLoanId();
    return new BookLoan(loanId, book, member, dueDate);
  }

  private generateLoanId(): string {
    return `LOAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## Domain Experts

**Domain Experts** are people who deeply understand the business domain—they are the source of knowledge about how the business works. They might be:

- Business analysts
- Product managers
- Subject matter experts
- End users with deep experience
- Industry specialists

In DDD, developers work closely with domain experts to:

1. Learn the domain language and concepts
2. Identify important business rules and workflows
3. Model the domain accurately in code
4. Validate that the software solves real problems

## Domain-Driven Design Approach to Domain

DDD advocates for:

### 1. **Deep Domain Understanding**

Don't just implement features—understand why they matter and how they fit into the bigger business picture.

### 2. **Collaboration with Domain Experts**

Regular conversations and knowledge sharing between developers and domain experts.

### 3. **Ubiquitous Language**

Create a shared vocabulary that both technical and business teams use consistently.

### 4. **Focus on Core Domain**

Invest the most time and best developers on the parts of the domain that provide competitive advantage.

### 5. **Bounded Contexts**

Divide large domains into smaller, well-defined boundaries where specific models apply.

## Practical Exercise: Identifying Your Domain

When starting a new project, ask these questions:

1. **What business problem are we solving?**
2. **Who are the key users and what do they need to accomplish?**
3. **What are the main concepts and entities in this business area?**
4. **What are the most important business rules?**
5. **What makes this business unique or different from competitors?**
6. **What parts of the system are most critical to business success?**

## Key Takeaway

The **Domain** is the heart of your application—it's the real-world business context that your software represents. Understanding the domain deeply and modeling it accurately in code is the foundation of Domain-Driven Design.

When you understand the domain well:

- Your code becomes a reflection of business reality
- Communication improves between technical and business teams
- The software delivers real business value
- Maintenance and evolution become easier because the code makes business sense

**Remember**: Good software starts with understanding the problem domain, not just writing code.
