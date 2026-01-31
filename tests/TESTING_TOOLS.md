# Testing Stack: Mocha, Chai, and Sinon

## Overview

This project uses three complementary testing libraries that work together to provide a complete testing solution for JavaScript applications. Each library has a specific responsibility in the testing workflow.

## The Testing Stack

### 🧪 Mocha - Test Framework (The Runner)

**What it is:** Mocha is the test framework that provides the structure and runs your tests.

**Responsibilities:**

- Organizes tests with `describe()` and `it()` blocks
- Runs tests and reports results
- Handles test lifecycle (before, after, beforeEach, afterEach)
- Supports async testing (promises, async/await)
- Provides CLI for running tests

**Key Features:**

- Flexible and unopinionated
- Works in Node.js and browsers
- Supports multiple assertion libraries
- Rich ecosystem of plugins
- Detailed test reporting

**Example Structure:**

```javascript
describe('Patient Entity', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should create a patient with valid data', () => {
    // Test implementation
  });

  it('should throw error for invalid email', () => {
    // Test implementation
  });
});
```

---

### ✅ Chai - Assertion Library (The Validator)

**What it is:** Chai provides the assertion functions to validate that your code behaves as expected.

**Responsibilities:**

- Provides readable assertion syntax
- Compares expected vs actual values
- Throws errors when assertions fail
- Offers multiple assertion styles

**Three Assertion Styles:**

**1. Should (BDD - Behavior Driven Development):**

```javascript
patient.name.should.equal('John Doe');
patient.email.should.include('@');
```

**2. Expect (BDD - Most Popular):**

```javascript
expect(patient.name).to.equal('John Doe');
expect(patient.allergies).to.have.lengthOf(2);
expect(patient.isActive).to.be.true;
```

**3. Assert (TDD - Test Driven Development):**

```javascript
assert.equal(patient.name, 'John Doe');
assert.isTrue(patient.isActive);
```

**Common Assertions:**

- Equality: `equal`, `deep.equal`
- Type checking: `be.a('string')`, `be.an('object')`
- Presence: `exist`, `be.null`, `be.undefined`
- Properties: `have.property`, `include`
- Collections: `have.lengthOf`, `be.empty`
- Booleans: `be.true`, `be.false`
- Comparisons: `be.above`, `be.below`

---

### 🎭 Sinon - Test Doubles Library (The Faker)

**What it is:** Sinon provides test doubles (spies, stubs, mocks) to isolate and control dependencies during testing.

**Responsibilities:**

- Creates fake functions and objects
- Tracks function calls and arguments
- Replaces real implementations temporarily
- Simulates external dependencies
- Controls time (fake timers)

**Three Main Tools:**

### 1. **Spies** - Watch Function Calls

Spies observe function calls without changing behavior.

```javascript
const spy = sinon.spy(notificationService, 'sendEmail');

// Execute code
appointmentService.schedule(appointment);

// Verify spy was called
expect(spy.calledOnce).to.be.true;
expect(spy.calledWith('patient@email.com')).to.be.true;

spy.restore(); // Clean up
```

**Use when:** You want to verify a function was called but keep its original behavior.

### 2. **Stubs** - Replace Function Behavior

Stubs replace functions with controlled behavior.

```javascript
const stub = sinon.stub(patientRepository, 'findById');
stub.returns(mockPatient);

// Now patientRepository.findById() returns mockPatient
const result = await patientService.getPatient('123');

expect(result).to.equal(mockPatient);
stub.restore();
```

**Use when:** You want to control what a function returns or prevent side effects.

### 3. **Mocks** - Pre-programmed Expectations

Mocks combine stubs with built-in assertions.

```javascript
const mock = sinon.mock(emailService);
mock.expects('send').once().withArgs('test@email.com');

// Execute code
notificationService.notify('test@email.com');

// Verify all expectations were met
mock.verify();
mock.restore();
```

**Use when:** You want to verify complex interactions with strict expectations.

---

## How They Work Together

### The Perfect Trio

```javascript
// Mocha provides structure
describe('AppointmentService', () => {
  let appointmentService;
  let patientRepositoryStub;
  let notificationServiceSpy;

  beforeEach(() => {
    // Sinon creates test doubles
    patientRepositoryStub = sinon.stub(patientRepository, 'findById');
    notificationServiceSpy = sinon.spy(notificationService, 'sendEmail');

    appointmentService = new AppointmentService(
      patientRepository,
      notificationService
    );
  });

  afterEach(() => {
    // Clean up Sinon test doubles
    sinon.restore();
  });

  // Mocha defines the test
  it('should schedule appointment and send notification', async () => {
    // Sinon controls dependencies
    const mockPatient = { id: '1', email: 'patient@email.com' };
    patientRepositoryStub.returns(mockPatient);

    // Execute the code under test
    const result = await appointmentService.schedule({
      patientId: '1',
      doctorId: '2',
      date: '2024-07-01',
    });

    // Chai validates the results
    expect(result.status).to.equal('scheduled');

    // Chai + Sinon verify behavior
    expect(notificationServiceSpy.calledOnce).to.be.true;
    expect(notificationServiceSpy.calledWith('patient@email.com')).to.be.true;
  });
});
```

---

## Why This Stack for DDD/Hexagonal Architecture?

### 1. **Testing Domain Logic (Pure Business Rules)**

```javascript
describe('Patient Entity - Domain Logic', () => {
  it('should not allow adding duplicate allergies', () => {
    const patient = new Patient(/* ... */);
    const allergy = new Allergy('Penicillin');

    patient.addAllergy(allergy);

    // Chai validates domain rules
    expect(() => patient.addAllergy(allergy)).to.throw(
      'Allergy already exists'
    );
  });
});
```

### 2. **Testing with Mocked Dependencies (Ports)**

```javascript
describe('AppointmentService - Application Layer', () => {
  it('should use repository port to save appointment', async () => {
    // Sinon stubs the outbound port
    const saveStub = sinon.stub(appointmentRepository, 'save');
    saveStub.resolves({ id: '123' });

    const service = new AppointmentService(appointmentRepository);
    const result = await service.createAppointment(appointmentData);

    // Chai validates the result
    expect(result.id).to.equal('123');
    // Sinon + Chai verify port was called correctly
    expect(saveStub.calledOnce).to.be.true;
  });
});
```

### 3. **Testing Adapters (Infrastructure Layer)**

```javascript
describe('PatientRepository - Adapter', () => {
  it('should map database result to domain entity', () => {
    const dbData = { /* database format */ };
    const repository = new PatientRepository(mockDatabase);

    // Sinon stubs external dependency
    const findStub = sinon.stub(mockDatabase, 'query');
    findStub.resolves(dbData);

    const patient = await repository.findById('123');

    // Chai validates correct mapping
    expect(patient).to.be.instanceOf(Patient);
    expect(patient.name).to.equal(dbData.patient_name);
  });
});
```

---

## Quick Reference

### Installation

```bash
npm install --save-dev mocha chai sinon
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific file
npx mocha tests/unit/domain/entities/patient.test.js

# Run with watch mode
npx mocha --watch

# Run with grep pattern
npx mocha --grep "Patient"
```

### Common Patterns

**Test File Template:**

```javascript
import { expect } from 'chai';
import sinon from 'sinon';
import { Patient } from '../../../../src/domain/entities/patient.js';

describe('Patient Entity', () => {
  let sandbox;

  beforeEach(() => {
    // Create sandbox for automatic cleanup
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    // Restore all stubs/spies automatically
    sandbox.restore();
  });

  describe('addAllergy', () => {
    it('should add allergy to patient', () => {
      const patient = new Patient(/* ... */);
      const allergy = { type: 'Penicillin' };

      patient.addAllergy(allergy);

      expect(patient.allergies).to.have.lengthOf(1);
      expect(patient.allergies[0]).to.deep.equal(allergy);
    });
  });
});
```

---

## Best Practices

### ✅ Do's

- Use `expect` style for consistency
- Create sandbox for automatic cleanup: `sinon.createSandbox()`
- Restore stubs in `afterEach` hooks
- Test one thing per test case
- Use descriptive test names
- Keep tests isolated and independent

### ❌ Don'ts

- Don't mix assertion styles (pick one and stick with it)
- Don't forget to restore stubs/spies
- Don't test implementation details
- Don't make tests dependent on each other
- Don't use real external services in unit tests

---

## Resources

- **Mocha**: https://mochajs.org/
- **Chai**: https://www.chaijs.com/
- **Sinon**: https://sinonjs.org/

## Summary

| Library   | Role              | Primary Use                    |
| --------- | ----------------- | ------------------------------ |
| **Mocha** | Test Runner       | Structure and execute tests    |
| **Chai**  | Assertion Library | Validate expected outcomes     |
| **Sinon** | Test Doubles      | Mock dependencies and behavior |

Together, they provide everything needed to write comprehensive tests for DDD applications with hexagonal architecture, allowing you to test domain logic in isolation while controlling external dependencies.
