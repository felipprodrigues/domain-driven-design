# Anticorruption Layer (ACL)

## What is it?

The Anticorruption Layer is a strategic design pattern in Domain-Driven Design that acts as a protective boundary between different bounded contexts or subsystems. It serves as a translator or adapter that isolates your domain model from external systems, legacy code, or third-party integrations that might have incompatible models or designs.

Think of it as a diplomatic translator between two countries that speak different languages and have different customs. The ACL ensures that the "foreign" concepts and structures from external systems don't leak into and corrupt your carefully designed domain model.

The Anticorruption Layer typically sits at the boundary of your bounded context and translates:

- **Incoming data**: Converting external models into your domain's language and concepts
- **Outgoing requests**: Transforming your domain objects into formats the external system understands
- **Business rules**: Preventing external system constraints from affecting your domain logic

## Why Use an Anticorruption Layer?

### 1. **Preserve Domain Model Integrity**

Your domain model represents the core business logic and should reflect the language and concepts of your business domain (Ubiquitous Language). External systems often have their own models that may:

- Use different terminology
- Have different business rules
- Represent concepts in incompatible ways
- Include technical concerns that don't belong in your domain

Without an ACL, you'd be forced to compromise your domain model to accommodate these external quirks, leading to a polluted and confusing codebase.

### 2. **Independence from External Changes**

External systems evolve independently of your application. They may:

- Change their API contracts
- Modify data structures
- Update field names or formats
- Introduce breaking changes

With an ACL, these changes are contained at the boundary. You only need to update the translation layer rather than rippling changes throughout your entire domain model.

### 3. **Integration with Legacy Systems**

Legacy systems often have outdated designs, poor abstractions, or technical debt. An ACL allows you to:

- Work with legacy systems without adopting their flaws
- Gradually migrate away from legacy systems
- Maintain a clean, modern domain model while still interacting with older code

### 4. **Third-Party Service Integration**

When integrating with external APIs or services (payment gateways, shipping providers, CRM systems), the ACL:

- Prevents vendor lock-in by isolating vendor-specific details
- Makes it easier to switch providers
- Keeps your domain model independent of external service peculiarities

## Benefits

### **Maintainability**

The ACL creates a clear separation of concerns. Your domain model remains clean and focused on business logic, while integration complexity is isolated to dedicated translation components. This makes the codebase easier to understand and maintain.

### **Testability**

You can test your domain model in isolation without needing to set up external systems. The ACL provides natural seams for mocking and stubbing external dependencies.

### **Flexibility**

Changes to external systems or switching to alternative providers requires modifications only to the ACL, not your entire application. This significantly reduces the cost and risk of change.

### **Domain Model Purity**

Your domain model can use natural, business-oriented language and structures without being constrained by the technical details of external systems. This leads to code that better reflects the business and is more intuitive for domain experts.

### **Reduced Coupling**

The ACL minimizes coupling between your bounded context and external systems. Your domain depends on abstractions (interfaces) defined by the ACL, not concrete implementations of external services.

### **Evolutionary Architecture**

As your understanding of the domain grows, you can evolve your domain model freely. The ACL adapts the external world to your model, rather than forcing your model to adapt to external constraints.

## When to Use an Anticorruption Layer

Consider implementing an ACL when:

- **Integrating with legacy systems** that have poor or outdated designs
- **Working with third-party APIs** where you don't control the model or contract
- **Connecting to external systems** that use different domain languages or concepts
- **Dealing with systems that change frequently** and you want to isolate your domain from those changes
- **Your domain model is significantly different** from the external system's model
- **You're planning to migrate** from one system to another gradually

## When NOT to Use an Anticorruption Layer

An ACL adds complexity and translation overhead. You might not need one when:

- Both systems share the same bounded context and ubiquitous language
- The external system's model is simple and aligns well with your domain
- You're building a simple CRUD application without a rich domain model
- The translation would be trivial or one-to-one mapping
- The systems are tightly coupled by design and share the same vision

## Implementation Considerations

While we're not diving into code, it's worth noting that an ACL typically consists of:

- **Facades**: Simplify complex external interfaces
- **Adapters**: Convert between different object models
- **Translators**: Transform data structures and terminology
- **Repositories**: Provide domain-oriented access to external data
- **Services**: Encapsulate external operations in domain terms

The ACL should be designed as part of your application layer or infrastructure layer, never within your domain layer itself. The domain remains pure and unaware of external system details.

## Real-World Analogy

Imagine you're running a modern restaurant (your domain) but you need to order supplies from a vendor who still uses fax machines and paper catalogs with outdated product codes. Instead of cluttering your modern digital ordering system with fax protocols and cryptic product codes, you create a translation service (ACL) that:

- Accepts orders in your modern format
- Translates them to the vendor's archaic format
- Sends the fax
- Receives confirmations and translates them back to your system

Your restaurant staff (domain logic) never needs to know about faxes or old product codes. If you switch vendors, you only update the translation service, not your entire ordering workflow.

## Conclusion

The Anticorruption Layer is a powerful pattern for maintaining the integrity and independence of your domain model in a world where integration with external systems is inevitable. While it adds a layer of indirection and complexity, the benefits in terms of maintainability, flexibility, and domain model purity often far outweigh the costs, especially in complex domains or when dealing with problematic external systems.

The key is to use it judiciously—where the protection and isolation it provides genuinely add value to your architecture.
