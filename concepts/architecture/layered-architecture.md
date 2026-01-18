# Domain Architecture: Layered Architecture

> **Note**: While this document explains traditional Layered Architecture, the [Rocket Medic implementation](../../README.md) uses **Hexagonal Architecture**, which is an evolution of layered architecture. See [hexagonal-architecture.md](hexagonal-architecture.md) for comparison.

## What is Layered Architecture?

**Layered Architecture** is a way of organizing your software into distinct horizontal layers, where each layer has a specific responsibility and role. Think of it like a building with different floors—each floor serves a specific purpose and follows certain rules about how it interacts with other floors.

In the context of Domain-Driven Design, layered architecture helps keep your business logic (domain) clean, isolated, and independent from technical details like databases, user interfaces, and external services.

## The Core Principle

> **Each layer should only depend on the layers below it, never on the layers above it.**

This creates a one-way flow of dependencies, making your code more maintainable and flexible.

## The Four Main Layers

### 1. Presentation Layer (User Interface Layer)

**What it does:** This is the layer that users interact with directly.

**Responsibilities:**

- Display information to users (web pages, mobile screens, API responses)
- Capture user input (forms, buttons, API requests)
- Format data for display
- Handle user navigation and workflows

**Examples:**

- A website showing product listings
- A mobile app displaying your shopping cart
- REST API endpoints that return JSON
- A command-line interface accepting commands

**What it should NOT do:**

- Contain business rules
- Directly access the database
- Perform calculations or validations that are business-related

**Think of it as:** The reception desk of a company—it greets visitors, takes their requests, and shows them information, but doesn't make business decisions.

### 2. Application Layer (Use Case Layer)

**What it does:** This layer orchestrates and coordinates the application's tasks.

**Responsibilities:**

- Define what the application can do (use cases)
- Coordinate between different domain objects
- Manage transactions
- Handle application-specific workflows
- Direct tasks but delegate actual work to the domain layer

**Examples:**

- "Process an order" workflow that coordinates checking inventory, charging payment, and creating a shipment
- "Register a new user" use case that creates an account, sends a welcome email, and logs the event
- "Generate monthly report" task that gathers data and formats it

**What it should NOT do:**

- Contain business rules (those belong in the domain layer)
- Know about database implementation details
- Directly handle HTTP requests or UI rendering

**Think of it as:** A project manager who knows what needs to happen and coordinates different teams, but doesn't do the actual specialized work themselves.

### 3. Domain Layer (Business Logic Layer)

**What it does:** This is the heart of your application—it contains all the business logic and rules.

**Responsibilities:**

- Model business concepts (customers, orders, products)
- Enforce business rules and invariants
- Perform business calculations
- Define what's valid and invalid in your business context
- Represent the core knowledge of your domain

**Examples:**

- "A customer can only place an order if their cart isn't empty"
- "Premium members get 15% discount"
- "An appointment can't be scheduled less than 24 hours in advance"
- Calculating interest on a loan
- Determining if a patient is eligible for a treatment

**What it should NOT do:**

- Know about databases or how data is stored
- Know about web frameworks or HTTP
- Know about UI components or formatting
- Depend on external libraries or frameworks

**Think of it as:** The expert professionals who know the business inside and out—doctors, engineers, accountants—who apply their specialized knowledge to solve problems.

### 4. Infrastructure Layer (Persistence & External Services Layer)

**What it does:** This layer handles all technical concerns and external communications.

**Responsibilities:**

- Save and retrieve data from databases
- Communicate with external APIs and services
- Handle file storage
- Send emails and notifications
- Logging and monitoring
- Implement security mechanisms

**Examples:**

- Connecting to PostgreSQL database and running SQL queries
- Calling Stripe API to process payments
- Sending emails via SendGrid
- Storing files in Amazon S3
- Writing logs to a file or monitoring service

**What it should NOT do:**

- Contain business rules or logic
- Make business decisions
- Know about UI or presentation details

**Think of it as:** The support staff and facilities—IT department, mailroom, security—that handle the technical and operational aspects of running the business.

## How the Layers Interact

### The Flow of a Request

Let's walk through what happens when a user places an order:

```
1. USER CLICKS "PLACE ORDER" BUTTON
   ↓
2. PRESENTATION LAYER
   - Receives the click event
   - Gathers form data
   - Sends request to Application Layer
   ↓
3. APPLICATION LAYER
   - Receives "PlaceOrder" command
   - Starts a transaction
   - Asks Domain Layer to validate and create order
   - Asks Infrastructure Layer to save the order
   - Asks Infrastructure Layer to send confirmation email
   - Returns success/failure to Presentation Layer
   ↓
4. DOMAIN LAYER
   - Validates business rules (cart not empty, valid items, etc.)
   - Calculates order total with discounts
   - Creates Order entity
   - Applies any business logic
   ↓
5. INFRASTRUCTURE LAYER
   - Saves order to database
   - Sends email via email service
   - Logs the transaction
   ↓
6. PRESENTATION LAYER
   - Receives success response
   - Shows confirmation message to user
```

### Dependency Direction

```
┌───────────────────────────────┐
│    Presentation Layer          │ ←── Users interact here
└───────────────────────────────┘
         ↓ depends on
┌───────────────────────────────┐
│    Application Layer           │ ←── Orchestrates workflows
└───────────────────────────────┘
         ↓ depends on
┌───────────────────────────────┐
│    Domain Layer ⭐             │ ←── Pure business logic (most important!)
└───────────────────────────────┘
         ↑ implements interfaces
┌───────────────────────────────┐
│    Infrastructure Layer        │ ←── Technical implementation
└───────────────────────────────┘
```

**Important:** The Domain Layer defines what it needs (interfaces), and the Infrastructure Layer implements those needs. This keeps the domain independent.

## Benefits of Layered Architecture

### 1. **Separation of Concerns**

Each layer has a clear, focused responsibility. This means developers know exactly where to put new code and where to look when fixing bugs.

**Practical Benefits:**

- **Easier to navigate**: Need to fix a display issue? Check Presentation Layer. Business rule broken? Look in Domain Layer.
- **Reduced complexity**: Each layer deals with a specific type of problem, making the overall system easier to understand
- **Clear boundaries**: Team members can work on their layer without needing to understand every detail of other layers
- **Less mental overhead**: You can focus on one concern at a time without being overwhelmed by unrelated details

**Real-world example:** When a customer reports that discount calculations are wrong, you immediately know to check the Domain Layer, not the database code or UI components.

### 2. **Flexibility and Changeability**

Layered architecture makes it easy to change or replace parts of your system without affecting others.

**Technology Changes:**

- **Switch databases**: Change from MySQL to PostgreSQL or MongoDB by only modifying the Infrastructure Layer
- **Change UI framework**: Move from React to Vue, or add a mobile app alongside your web app by creating new Presentation Layers
- **Replace external services**: Switch from SendGrid to Mailgun for emails without touching business logic

**Business Changes:**

- **Update business rules**: Modify pricing, discounts, or workflows in the Domain Layer without breaking the UI or database
- **Add new interfaces**: Add a REST API, GraphQL endpoint, or mobile app using the same Domain and Application layers

**Real-world example:** A company wants to add a mobile app to their existing web application. They can reuse all the Application and Domain layers, only building a new Presentation Layer for mobile.

### 3. **Improved Testability**

Each layer can be tested independently, leading to faster, more reliable testing.

**Testing Benefits:**

- **Unit test business logic**: Test Domain Layer without needing a database, web server, or UI
- **Fast tests**: Pure business logic tests run in milliseconds
- **Isolated testing**: Test one layer at a time, making it easier to identify where bugs are
- **Easier mocking**: Clear interfaces between layers make it simple to create test doubles
- **Better coverage**: Can thoroughly test business rules without complicated setup

**Real-world example:** You can test whether "premium customers get 15% discount" works correctly without setting up a database, starting a web server, or simulating user clicks.

### 4. **Better Maintainability**

Code organized into layers is easier to maintain, update, and debug over time.

**Maintenance Benefits:**

- **Locate issues faster**: Clear structure makes finding bugs quicker
- **Impact analysis**: Understand what will be affected by a change
- **Reduced ripple effects**: Changes in one layer rarely require changes in others
- **Documentation through structure**: The architecture itself documents how the system is organized
- **Onboarding new developers**: New team members can understand the system faster

**Real-world example:** When fixing a bug, you can determine if it's a display issue (Presentation), workflow issue (Application), business logic issue (Domain), or data storage issue (Infrastructure) and focus your debugging efforts accordingly.

### 5. **Enhanced Team Collaboration**

Different teams or developers can work on different layers simultaneously without conflicts.

**Collaboration Benefits:**

- **Parallel development**: Frontend team works on Presentation while backend team works on Domain and Infrastructure
- **Specialized skills**: Developers can focus on their strengths (UI specialists, business logic experts, database experts)
- **Less merge conflicts**: Teams working on different layers modify different files
- **Clear ownership**: Teams can own specific layers
- **Independent progress**: One team's work doesn't block another team

**Real-world example:** The UI team can build new screens while the backend team implements new business features, and they'll integrate smoothly because they're following the same interfaces.

### 6. **Reusability**

Business logic in the Domain Layer can be reused across multiple applications and interfaces.

**Reusability Benefits:**

- **Write once, use everywhere**: Same business rules work for web, mobile, API, CLI, and batch jobs
- **Consistent behavior**: Business logic behaves identically across all platforms
- **Reduced duplication**: Don't rewrite business rules for each new interface
- **Lower development cost**: New applications can leverage existing domain logic

**Real-world example:** Your pricing calculation logic written once in the Domain Layer is used by your website, mobile app, customer service portal, and automated billing system—all guaranteed to calculate prices identically.

### 7. **Technology Independence**

The core business logic (Domain Layer) doesn't depend on specific technologies or frameworks.

**Independence Benefits:**

- **Framework agnostic**: Not locked into a specific web framework or database
- **Future-proof**: Can adopt new technologies without rewriting business logic
- **Avoid vendor lock-in**: Not tied to proprietary solutions
- **Framework updates easier**: Upgrading or changing frameworks only affects outer layers
- **Long-term sustainability**: Business logic can outlive specific technology choices

**Real-world example:** When a popular web framework becomes outdated, you can migrate to a new one without touching your valuable business logic that took years to perfect.

### 8. **Scalability**

Layered architecture makes it easier to scale your application as it grows.

**Scalability Benefits:**

- **Scale layers independently**: Put the Presentation Layer on CDN servers while scaling the Application Layer on separate servers
- **Distribute workload**: Different layers can run on different machines or services
- **Microservices ready**: Each layer or combination of layers can become a separate service
- **Performance optimization**: Optimize each layer independently (caching in Presentation, database indexing in Infrastructure)
- **Gradual growth**: Start simple and add complexity only where needed

**Real-world example:** During Black Friday sales, you can scale your Presentation and Application layers to handle more traffic while keeping the Infrastructure Layer stable.

### 9. **Clarity and Understanding**

The layered structure makes the codebase easier to understand for everyone.

**Understanding Benefits:**

- **Consistent organization**: Every developer knows where to find things
- **Reduced cognitive load**: Don't need to understand everything at once
- **Clear entry points**: Know where requests enter and flow through the system
- **Better documentation**: Structure itself communicates architecture decisions
- **Easier code reviews**: Reviewers know what to expect in each layer

**Real-world example:** A new developer joining your team can understand the system in days instead of months because the layered organization provides a clear mental model.

### 10. **Risk Reduction**

Proper layering reduces the risk of bugs and system failures.

**Risk Reduction Benefits:**

- **Isolated failures**: Problems in one layer don't cascade to others
- **Easier rollbacks**: Can rollback changes to one layer without affecting others
- **Safer refactoring**: Refactor a layer with confidence knowing interfaces protect other layers
- **Validation at boundaries**: Each layer can validate inputs from the layer above
- **Security improvements**: Can implement security at appropriate layers (authentication in Application, authorization in Domain)

**Real-world example:** If a new feature in the Presentation Layer has a bug, it won't corrupt data in the database or break business rules because those concerns are isolated in other layers.

## Summary of Key Benefits

| Benefit                     | Impact                                           |
| --------------------------- | ------------------------------------------------ |
| **Separation of Concerns**  | Each layer has one job, reducing complexity      |
| **Flexibility**             | Easy to change technologies and add new features |
| **Testability**             | Fast, reliable testing without complex setup     |
| **Maintainability**         | Easier to fix bugs and understand code           |
| **Team Collaboration**      | Multiple teams work efficiently together         |
| **Reusability**             | Write business logic once, use everywhere        |
| **Technology Independence** | Not locked into specific frameworks              |
| **Scalability**             | Grow your system smoothly                        |
| **Clarity**                 | Everyone understands the structure               |
| **Risk Reduction**          | Fewer bugs and safer changes                     |

## Common Pitfalls to Avoid

### ❌ **Skipping Layers**

Don't let the Presentation Layer directly access the Infrastructure Layer. Always go through the Application and Domain layers.

### ❌ **Wrong Direction Dependencies**

The Domain Layer should never depend on the Presentation or Infrastructure layers. Keep dependencies flowing downward.

### ❌ **Mixing Responsibilities**

Don't put business logic in the Presentation Layer or database queries in the Domain Layer. Each layer has its job.

### ❌ **Anemic Domain Layer**

Don't make the Domain Layer just a bunch of data containers with no behavior. Put your business logic there!

### ❌ **Fat Application Layer**

Don't put business rules in the Application Layer. It should orchestrate, not decide business logic.

## Real-World Analogy: A Restaurant

Think of a restaurant to understand layered architecture:

- **Presentation Layer** = The dining room and waiters
  - Customers interact here
  - Takes orders and serves food
  - Presents the menu

- **Application Layer** = Head waiter / Manager
  - Coordinates between front and back of house
  - Manages the flow of orders
  - Ensures everything runs smoothly

- **Domain Layer** = The chef and recipes
  - Contains the expertise and knowledge
  - Knows how to make each dish
  - Enforces quality standards and cooking rules

- **Infrastructure Layer** = The kitchen equipment and suppliers
  - Provides tools and resources
  - Stores ingredients (database)
  - Connects to suppliers (external services)

Just like in a restaurant, each role has clear responsibilities, and you wouldn't ask the waiter to cook or the chef to serve tables!

## Layered vs Hexagonal: Rocket Medic Example

The **Rocket Medic** implementation in this repository uses **Hexagonal Architecture** rather than traditional layered architecture. Here's why and how they differ:

### Traditional Layered Architecture

```
┌─────────────────────────────┐
│   Presentation Layer        │ ← Controllers, Views, API
├─────────────────────────────┤
│   Application Layer         │ ← Use Cases, Workflows
├─────────────────────────────┤
│   Domain Layer              │ ← Business Logic
├─────────────────────────────┤
│   Infrastructure Layer      │ ← Database, External APIs
└─────────────────────────────┘
       Dependencies flow DOWN
```

### Hexagonal Architecture (Rocket Medic)

```
        ┌──────────────────┐
        │   Controllers    │ ← Inbound Adapter
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │ Application      │ ← Inbound Port
        └────────┬─────────┘
                 │
    ╔════════════▼════════════╗
    ║    DOMAIN CORE          ║
    ║  (Entities, Services)   ║
    ╚════════════┬════════════╝
                 │
        ┌────────▼─────────┐
        │  Repositories    │ ← Outbound Adapters
        │  Notifications   │
        └──────────────────┘
```

### Key Differences in Rocket Medic

| Aspect                   | Layered                              | Hexagonal (Rocket Medic)                                |
| ------------------------ | ------------------------------------ | ------------------------------------------------------- |
| **Organization**         | Horizontal layers                    | Core with adapters                                      |
| **Structure**            | `src/presentation/`, `src/domain/`   | `src/domain/`, `src/interfaces/`                        |
| **Repositories**         | In Infrastructure layer below Domain | Interfaces in Domain, implementations in Infrastructure |
| **Focus**                | Layer separation                     | Port/Adapter separation                                 |
| **Dependency Inversion** | Implicit                             | Explicit with interfaces                                |

### Rocket Medic Structure

```javascript
src/
├── domain/                    # Core (equivalent to Domain Layer)
│   ├── entities/             # Business entities
│   ├── value-objects/        # Immutable values
│   ├── services/             # Business logic
│   └── repositories/         # Repository INTERFACES (ports)
│
├── application/              # Use Cases (orchestration)
│   └── services/            # Application services
│
├── infrastructure/           # Outbound Adapters
│   ├── persistance/         # Repository IMPLEMENTATIONS
│   └── notification/        # External service implementations
│
└── interfaces/              # Inbound Adapters
    ├── controllers/        # HTTP request handlers
    ├── routes/            # API routes
    └── main.js           # Application bootstrap
```

### Why Hexagonal for Rocket Medic?

1. **Better Testability**: Can test domain logic without any infrastructure
2. **Framework Independence**: Domain doesn't know about Express.js
3. **Multiple Interfaces**: Easy to add CLI, GraphQL, or mobile API
4. **Dependency Inversion**: Infrastructure depends on domain, not vice versa
5. **Clear Boundaries**: Ports and adapters make boundaries explicit

### Example: Repository Pattern

**Layered approach** (dependency goes down):

```javascript
// Domain Layer
class PatientService {
  constructor() {
    this.repository = new PatientRepository(); // Direct dependency
  }
}

// Infrastructure Layer
class PatientRepository {
  // Database implementation
}
```

**Hexagonal approach** (dependency goes inward):

```javascript
// Domain Layer - defines interface
class Repository {
  save(entity) {
    throw new Error('Must implement');
  }
}

// Domain Layer - uses interface
class PatientService {
  constructor(repository) {
    // Injected!
    this.repository = repository; // Uses interface
  }
}

// Infrastructure Layer - implements interface
class PatientRepository extends Repository {
  save(entity) {
    /* implementation */
  }
}
```

### Both Achieve Similar Goals

Despite structural differences, both architectures aim for:

- ✅ Separation of concerns
- ✅ Domain independence
- ✅ Testability
- ✅ Maintainability
- ✅ Flexibility

**Learn More**:

- [Hexagonal Architecture Guide](hexagonal-architecture.md)
- [Rocket Medic Architecture](../../docs/ARCHITECTURE.md)
- [Domain Model](../../docs/DOMAIN_MODEL.md)

## Key Takeaway

Layered Architecture is about organizing your code into clear, well-defined layers where:

- **Presentation** handles user interaction
- **Application** coordinates workflows
- **Domain** contains business logic (the most important layer!)
- **Infrastructure** handles technical details

Each layer has a specific job, and they work together in a structured way to create maintainable, flexible, and understandable software. The Domain Layer sits at the center, protected from technical concerns, allowing you to focus on modeling your business accurately.
