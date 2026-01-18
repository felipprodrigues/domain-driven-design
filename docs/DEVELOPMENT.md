# Development Guide

> Guidelines for contributing and extending the Rocket Medic system

## 🎯 Development Philosophy

This project follows Domain-Driven Design principles with emphasis on:

- **Business logic first**: Domain model drives the architecture
- **Clean code**: Readable, maintainable, well-structured
- **Separation of concerns**: Each layer has distinct responsibilities
- **Test-driven approach**: Test your code
- **Continuous refactoring**: Keep improving the design

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd domain-drive-desing

# Install dependencies
npm install

# Run tests
cd src && node testCase/testHospital.js

# Start development server
npm start
```

### Recommended VS Code Extensions

- ESLint
- Prettier
- JavaScript (ES6) code snippets
- GitLens

## 📝 Coding Standards

### JavaScript Style Guide

**Use ES6+ Features**

```javascript
// ✅ Good - Arrow functions
const findPatient = (id) => repository.findById(id);

// ✅ Good - Destructuring
const { name, email } = patient;

// ✅ Good - Template literals
console.log(`Patient ${name} registered successfully`);

// ❌ Bad - var
var patient = {};

// ❌ Bad - String concatenation
console.log('Patient ' + name + ' registered');
```

**Use Meaningful Names**

```javascript
// ✅ Good
const activePatients = patients.filter((p) => p.isActive);
const doctorAvailabilityService = new DoctorAvailabilityService();

// ❌ Bad
const ap = patients.filter((p) => p.isActive);
const das = new DoctorAvailabilityService();
```

**Keep Functions Small**

```javascript
// ✅ Good - Single responsibility
function validatePatientData(patient) {
  if (!patient.name) throw new Error('Name required');
  if (!patient.email) throw new Error('Email required');
}

// ❌ Bad - Too many responsibilities
function handlePatient(patient) {
  // validation
  // persistence
  // notification
  // logging
}
```

### File Organization

**One class per file**

```javascript
// patient.js
export class Patient {
  // ...
}

// Don't mix multiple classes in one file
```

**Use index files for clean imports** (when needed)

```javascript
// domain/entities/index.js
export { Patient } from './patient.js';
export { Doctor } from './doctor.js';

// Then import
import { Patient, Doctor } from './domain/entities/index.js';
```

## 🏗️ Adding New Features

### 1. Adding a New Entity

**Steps:**

1. Create entity file in `src/domain/entities/`
2. Define business rules and invariants
3. Add repository interface if needed
4. Implement repository in `src/infrastructure/persistance/`
5. Create domain service if needed
6. Add controller and routes

**Example: Adding Insurance Entity**

```javascript
// src/domain/entities/insurance.js
export class Insurance {
  constructor(provider, policyNumber, expirationDate) {
    this.validateData(provider, policyNumber);

    this.provider = provider;
    this.policyNumber = policyNumber;
    this.expirationDate = expirationDate;
  }

  validateData(provider, policyNumber) {
    if (!provider) throw new Error('Provider is required');
    if (!policyNumber) throw new Error('Policy number is required');
  }

  isExpired() {
    return new Date() > new Date(this.expirationDate);
  }

  equals(other) {
    return (
      this.provider === other.provider &&
      this.policyNumber === other.policyNumber
    );
  }
}
```

### 2. Adding a New Value Object

Value objects should be:

- Immutable
- Compared by value
- Validated at construction

```javascript
// src/domain/value-objects/phoneNumber.js
export class PhoneNumber {
  constructor(countryCode, number) {
    this.validateFormat(countryCode, number);

    this._countryCode = countryCode;
    this._number = number;
  }

  validateFormat(countryCode, number) {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(number)) {
      throw new Error('Invalid phone number format');
    }
  }

  get fullNumber() {
    return `${this._countryCode}${this._number}`;
  }

  equals(other) {
    return this.fullNumber === other.fullNumber;
  }
}
```

### 3. Adding a New Domain Service

Domain services contain business logic that:

- Doesn't naturally fit in an entity
- Operates on multiple aggregates
- Coordinates complex workflows

```javascript
// src/domain/services/billingService.js
export class BillingService {
  constructor(appointmentRepository, insuranceService) {
    this.appointmentRepository = appointmentRepository;
    this.insuranceService = insuranceService;
  }

  calculateTotalCost(patientId, startDate, endDate) {
    const appointments = this.appointmentRepository.findByPatientAndDateRange(
      patientId,
      startDate,
      endDate
    );

    const total = appointments.reduce((sum, apt) => sum + apt.cost, 0);
    const insurance = this.insuranceService.getCoverage(patientId);

    return {
      total,
      covered: total * insurance.coveragePercentage,
      patientOwes: total * (1 - insurance.coveragePercentage),
    };
  }
}
```

### 4. Adding a New API Endpoint

**Steps:**

1. Create controller method
2. Add route definition
3. Update apiRoutes.js
4. Document in API.md

```javascript
// src/interfaces/controllers/insuranceController.js
import express from 'express';

export class InsuranceController {
  constructor(insuranceService) {
    this.insuranceService = insuranceService;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.addInsurance.bind(this));
    this.router.get('/:patientId', this.getInsurance.bind(this));
  }

  async addInsurance(req, res) {
    try {
      const insurance = await this.insuranceService.add(req.body);
      res.status(201).json(insurance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getInsurance(req, res) {
    try {
      const { patientId } = req.params;
      const insurance = await this.insuranceService.findByPatient(patientId);
      res.status(200).json(insurance);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
```

## ✅ Testing Strategy

### Manual Testing

Use the test file to verify functionality:

```javascript
// src/testCase/testNewFeature.js
import { Insurance } from '../domain/entities/insurance.js';

const insurance = new Insurance('Blue Cross', 'BC123456', '2025-12-31');

console.log('Insurance created:', insurance);
console.log('Is expired?', insurance.isExpired());
```

### Integration Testing (Future)

Consider adding:

- Jest or Mocha for unit tests
- Supertest for API testing
- Test coverage reports

## 🔍 Code Review Checklist

Before committing code, verify:

- [ ] Follows DDD principles
- [ ] Business logic in domain layer
- [ ] No infrastructure dependencies in domain
- [ ] Meaningful variable/function names
- [ ] Functions are small and focused
- [ ] No code duplication
- [ ] Error handling implemented
- [ ] ESLint passes
- [ ] Code formatted with Prettier
- [ ] Documentation updated

## 🚀 Git Workflow

### Branch Naming

```
feature/add-insurance-entity
fix/patient-validation-bug
refactor/doctor-service
docs/update-api-documentation
```

### Commit Messages

```
feat: add insurance entity and repository
fix: resolve patient email validation issue
refactor: extract doctor availability logic to service
docs: update API documentation with new endpoints
```

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Testing

How was this tested?

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No linting errors
```

## 📦 Dependencies Management

### Adding Dependencies

```bash
# Production dependency
npm install express

# Development dependency
npm install --save-dev jest
```

### Dependency Guidelines

- Keep dependencies minimal
- Domain layer should have ZERO dependencies
- Review security advisories regularly
- Update dependencies cautiously

## 🎨 Design Patterns to Use

### Domain Layer

- ✅ **Aggregate Pattern**: Group related entities
- ✅ **Value Object Pattern**: Immutable objects
- ✅ **Repository Pattern**: Data access abstraction
- ✅ **Domain Service Pattern**: Complex business logic
- ✅ **Factory Pattern**: Complex object creation

### Application Layer

- ✅ **Service Pattern**: Use case orchestration
- ✅ **DTO Pattern**: Data transfer objects

### Infrastructure Layer

- ✅ **Adapter Pattern**: External service integration
- ✅ **Strategy Pattern**: Swappable implementations

## 🚫 Anti-Patterns to Avoid

- ❌ **Anemic Domain Model**: Entities with no behavior
- ❌ **God Object**: One class doing too much
- ❌ **Leaky Abstractions**: Implementation details exposed
- ❌ **Circular Dependencies**: Modules depending on each other
- ❌ **Magic Numbers**: Unexplained constants
- ❌ **Deep Nesting**: More than 3 levels of nesting

## 📊 Performance Considerations

### Database (Future)

- Use connection pooling
- Implement caching strategy
- Optimize queries
- Use indexes appropriately

### API

- Implement pagination
- Add rate limiting
- Use compression
- Cache responses when appropriate

## 🔐 Security Best Practices

### Input Validation

```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}
```

### Error Handling

```javascript
// Don't expose internal errors
try {
  // operation
} catch (error) {
  console.error('Internal error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

### Future Security Enhancements

- Implement authentication (JWT)
- Add authorization (RBAC)
- Sanitize user input
- Use HTTPS
- Implement rate limiting
- Add CORS configuration

## 📚 Learning Resources

### Domain-Driven Design

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing DDD by Vaughn Vernon](https://vaughnvernon.com/)
- [DDD Reference by Eric Evans](https://www.domainlanguage.com/ddd/reference/)

### Architecture

- [Clean Architecture by Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

### JavaScript/Node.js

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Getting Help

- Check existing documentation
- Review code examples in `src/testCase/`
- Look at similar implementations
- Ask questions in discussions

## 🎯 Next Steps

Potential enhancements:

1. Add unit and integration tests
2. Implement database persistence (PostgreSQL/MongoDB)
3. Add authentication and authorization
4. Implement domain events
5. Add API versioning
6. Create OpenAPI/Swagger documentation
7. Add logging and monitoring
8. Implement caching
9. Add WebSocket support for real-time updates
10. Create admin dashboard

---

**Happy Coding! 🚀**
