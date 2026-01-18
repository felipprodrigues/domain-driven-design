# Quick Start Guide

> Get up and running with Rocket Medic in 5 minutes

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Example

```bash
cd src && node testCase/testHospital.js
```

**Expected Output:**

```
Sending email to john.doe@example.com with message: Your appointment with Dr. Smith is scheduled for Monday, July 1, 2024 at 07:00 AM.
✓ Appointment scheduled successfully!
```

### 3. Start the API Server

```bash
npm start
```

Server runs at `http://localhost:3000`

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Get all doctors
curl http://localhost:3000/api/doctors

# Get all patients
curl http://localhost:3000/api/patients
```

## 📁 Project Structure

```
src/
├── domain/              # Core business logic
│   ├── entities/       # Domain entities
│   ├── value-objects/  # Immutable values
│   ├── services/       # Business rules
│   └── repositories/   # Data access interfaces
├── application/        # Use cases
├── infrastructure/     # Technical implementations
│   ├── persistance/   # In-memory repositories
│   └── notification/  # Email service
├── interfaces/        # API layer
│   ├── controllers/   # HTTP handlers
│   ├── routes/        # Route definitions
│   └── main.js        # Server entry point
└── testCase/          # Example usage
```

## 🎯 Your First API Call

### Create a Doctor

```bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "id": "102",
    "rcm": "CRM67890",
    "name": "Dr. Johnson",
    "specialty": ["Pediatrics"],
    "phoneNumber": "+1234567890"
  }'
```

### Create a Patient

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "id": "2",
    "identificationDocument": "456.456.456-45",
    "name": "Jane Smith",
    "dateOfBirth": "1985-05-15",
    "gender": "Female",
    "bloodType": "A+",
    "address": {
      "street": "Oak Avenue",
      "number": "456",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62702"
    },
    "phoneNumber": "+1555555555",
    "email": "jane.smith@example.com",
    "emergencyContact": {
      "name": "John Smith",
      "phoneNumber": "+1444444444"
    }
  }'
```

## 🧪 Understanding the Test Example

The test file demonstrates core DDD concepts:

```javascript
// src/testCase/testHospital.js

// 1. Create entities (domain objects)
const patient = new Patient(/* ... */);
const doctor = new Doctor(/* ... */);
const appointment = new Appointment(/* ... */);

// 2. Configure doctor availability
addedDoctor.workingHours.hours.push({
  day: 'Monday',
  timeSlot: '06:00 AM - 10:00 PM',
});

// 3. Add patient to repository
patientService.addPatient(patient);

// 4. Schedule appointment (business logic)
appointmentService.execute(appointment);
// ↳ Validates availability
// ↳ Checks conflicts
// ↳ Sends notification
```

## 📚 Next Steps

### For Beginners

1. ✅ Read [What is DDD?](domain-driven-design-explained.md)
2. ✅ Explore [Domain Model](docs/DOMAIN_MODEL.md)
3. ✅ Try the test examples
4. ✅ Modify patient/doctor data
5. ✅ Test API endpoints

### For Intermediate

1. ✅ Study [Architecture](docs/ARCHITECTURE.md)
2. ✅ Review domain services
3. ✅ Understand aggregates
4. ✅ Add new endpoints
5. ✅ Extend the domain model

### For Advanced

1. ✅ Read [Development Guide](docs/DEVELOPMENT.md)
2. ✅ Implement new features
3. ✅ Add persistence layer
4. ✅ Create new bounded contexts
5. ✅ Implement domain events

## 🛠️ Code Quality

```bash
# Check for linting issues
npm run lint

# Auto-fix formatting
npm run lint:fix

# Format all files
npm run format
```

## 📖 Documentation

- **[README](README.md)** - Project overview
- **[Architecture](docs/ARCHITECTURE.md)** - Technical details
- **[Domain Model](docs/DOMAIN_MODEL.md)** - Business rules
- **[API Reference](docs/API.md)** - Endpoint documentation
- **[Development Guide](docs/DEVELOPMENT.md)** - Contributing

## 🎓 Key Concepts

### Aggregates

Groups of related entities treated as a single unit.

- **Patient Aggregate**: Patient + Medical Record + Allergies
- **Doctor Aggregate**: Doctor + Working Hours

### Entities

Objects with unique identity.

- Examples: Patient, Doctor, Appointment

### Value Objects

Immutable objects identified by their attributes.

- Examples: Address, EmergencyContact, WorkingHours

### Domain Services

Business logic that doesn't fit in an entity.

- Examples: DoctorAvailabilityService, AppointmentService

### Repositories

Abstract data access for aggregates.

- Examples: PatientRepository, DoctorRepository

## 💡 Tips

- Start with the test examples
- Read the domain model documentation
- Explore one layer at a time
- Modify examples to learn
- Keep domain layer pure (no dependencies)

## 🚀 Ready to Build?

Check out the [Development Guide](docs/DEVELOPMENT.md) to:

- Add new features
- Create entities
- Build API endpoints
- Follow best practices

---

**Need help?** Check the documentation or review existing code examples!

isExpired() {
if (!this.expirationDate) return false;
return new Date(this.expirationDate) < new Date();
}
}

````

### 2. Add to Patient Aggregate

Update `rocket-medic/patient/patient.js`:

```javascript
import { Insurance } from '../shared/insurance.js';

export class Patient {
  constructor(
    id,
    identificationDocument,
    name,
    dateOfBirth,
    gender,
    bloodType,
    address,
    phoneNumber,
    email,
    emergencyContact,
    insurance // Add this parameter
  ) {
    // ... existing code ...
    this.insurance = insurance; // Add this line
    // ... rest of constructor ...
  }

  updateInsurance(insurance) {
    if (!(insurance instanceof Insurance)) {
      throw new Error('Invalid insurance');
    }

    if (insurance.isExpired()) {
      throw new Error('Cannot add expired insurance');
    }

    this.insurance = insurance;
    console.log(`Insurance updated for patient ${this.name}`);
  }
}
````

### 3. Test Your Changes

Update `testHospital.js`:

```javascript
import { Insurance } from './shared/insurance.js';

// Create insurance
const insurance = new Insurance('Blue Cross', 'BC123456789', '2025-12-31');

// Create patient with insurance
const patient = new Patient(
  '1',
  '123.123.123-12',
  'John Doe',
  '1990-01-01',
  'Male',
  'O+',
  address,
  '+1234567890',
  'johndoe@example.com',
  emergencyContact,
  insurance
);

// Later update insurance
const newInsurance = new Insurance('Aetna', 'AET987654321', '2026-06-30');
patient.updateInsurance(newInsurance);
```

### 4. Format and Test

```bash
npm run format
node testHospital.js
```

## 📚 Learning Path

### Beginner (Day 1)

1. Read [README.md](README.md) - Overview
2. Read [Domain-Driven Design Explained](domain-driven-design-explained.md) - Core concepts
3. Run `testHospital.js` - See it in action
4. Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Quick reference

### Intermediate (Day 2-3)

1. Read [Model Elements](concepts/model-elements.md) - Deep dive into patterns
2. Study [patient.js](rocket-medic/patient/patient.js) - Aggregate root example
3. Study value objects in `shared/` folder
4. Try the "Your First Modification" exercise above

### Advanced (Day 4-7)

1. Read [Aggregates](concepts/aggregates.md) - Advanced patterns
2. Read architecture documentation
3. Implement a new aggregate (e.g., Clinic, Department)
4. Add domain events
5. Implement repository pattern

## 🎨 Understanding the Code

### Entities vs Value Objects

**Entity (Patient):**

```javascript
// Has unique identity
const patient1 = new Patient('1', 'John Doe', ...);
const patient2 = new Patient('1', 'John Doe', ...);

// Same patient even with different name
patient1 === patient2 // false (different objects)
patient1.id === patient2.id // true (same identity)
```

**Value Object (Address):**

```javascript
// Defined by attributes
const addr1 = new Address('Main St', '123', 'City', 'ST', '12345');
const addr2 = new Address('Main St', '123', 'City', 'ST', '12345');

// Same address if all attributes match
addr1.equals(addr2); // true (same value)
```

### Aggregate Boundaries

**Patient Aggregate:**

```javascript
// ✅ Good: Operations through aggregate root
patient.addAllergy(allergy);
patient.scheduleAppointment(appointment);

// ❌ Bad: Direct manipulation
patient.allergies.push(allergy); // Bypasses business rules!
```

**Why this matters:**

- Business rules are enforced
- Invariants are protected
- Data stays consistent

## 🔍 Common Patterns

### Adding to Collections

```javascript
addSomething(item) {
  // 1. Validate type
  if (!(item instanceof ExpectedType)) {
    throw new Error('Invalid item');
  }

  // 2. Check business rules
  const hasConflict = this.items.some((existing) =>
    item.conflictsWith(existing)
  );

  // 3. Add if valid
  if (!hasConflict) {
    this.items.push(item);
    console.log('Item added');
  } else {
    throw new Error('Conflict detected');
  }
}
```

### Value Object Equality

```javascript
equals(other) {
  return (
    this.property1 === other.property1 &&
    this.property2 === other.property2 &&
    this.property3 === other.property3
  );
}
```

## 🐛 Troubleshooting

### Module not found error

```bash
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```

**Solution:** Ensure you're using ES6 modules with `.js` extensions in imports:

```javascript
import { Patient } from './patient/patient.js'; // ✅ Include .js
import { Patient } from './patient/patient'; // ❌ Missing .js
```

### Linting errors

```bash
npm run lint:fix  # Auto-fixes most issues
npm run format    # Formats all files
```

### Test not running

Make sure you're in the `rocket-medic` directory:

```bash
cd rocket-medic
node testHospital.js
```

## 📖 Next Steps

1. **Experiment**: Modify `testHospital.js` with different scenarios
2. **Add Features**: Implement the insurance example above
3. **Read Docs**: Dive deeper into specific topics
4. **Build Something**: Create your own domain model

## 💡 Key Takeaways

✅ **Aggregates** are consistency boundaries
✅ **Entities** have identity; **Value Objects** don't
✅ **Business rules** belong in the domain model
✅ **Modify aggregates** only through their root
✅ **Value objects** are immutable and defined by attributes

## 📞 Learning Resources

- [Eric Evans - DDD Book](https://www.domainlanguage.com/ddd/)
- [Martin Fowler - DDD](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Vaughn Vernon - Implementing DDD](https://vaughnvernon.com/)

## ✅ Checklist

Before moving on, make sure you can:

- [ ] Run the example successfully
- [ ] Explain the difference between Entity and Value Object
- [ ] Identify the two aggregates (Patient and Doctor)
- [ ] Add a new value object
- [ ] Add a method to an existing aggregate
- [ ] Run linting and formatting commands
- [ ] Understand why business rules live in aggregates

**Ready to build domain-driven applications!** 🚀
