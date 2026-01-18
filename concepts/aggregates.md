# Aggregates

## What is an Aggregate?

An **Aggregate** is a cluster of domain objects (entities and value objects) that can be treated as a single unit for data changes. It's one of the most important tactical patterns in Domain-Driven Design.

Each aggregate has a root entity, called the **Aggregate Root**, which is the only member of the aggregate that external objects are allowed to hold references to.

## Key Characteristics

### 1. Aggregate Root

- The root entity that controls all access to the aggregate
- Acts as a gateway to the aggregate's internal structure
- Only entity that can be directly accessed from outside
- Holds references to other entities and value objects within the aggregate

### 2. Consistency Boundary

- Defines the boundary of what must be consistent at all times
- All invariants (business rules) are enforced within this boundary
- Changes to the aggregate are atomic - either all succeed or all fail

### 3. Identity

- The aggregate root has a unique identity
- Internal entities may have local identity
- External references should only point to the aggregate root's ID

## Why Use Aggregates?

1. **Maintain Consistency**: Ensures business rules and invariants are always satisfied
2. **Simplify Design**: Clear boundaries make the domain model easier to understand
3. **Improve Performance**: Smaller, well-defined transaction boundaries
4. **Enable Scalability**: Natural boundaries for distribution and concurrency

## Rules for Designing Aggregates

### Rule 1: Protect Business Invariants

The primary purpose of an aggregate is to protect invariants - business rules that must always be true.

**Example**: In a medical record, diagnoses, treatments, and medications must be added through proper validation to ensure data integrity.

### Rule 2: Design Small Aggregates

Keep aggregates as small as possible while still protecting invariants. Smaller aggregates:

- Are easier to maintain
- Have better performance
- Reduce locking conflicts
- Are easier to distribute

### Rule 3: Reference Other Aggregates by Identity

Never hold direct object references to other aggregates. Instead, use their IDs.

```javascript
// ❌ Bad - Direct reference
class Appointment {
  constructor(patient, doctor) {
    this.patient = patient; // Direct reference to Patient aggregate
    this.doctor = doctor; // Direct reference to Doctor aggregate
  }
}

// ✅ Good - Reference by ID (Production approach)
class Appointment {
  constructor(patientId, doctorId) {
    this.patientId = patientId; // Reference by ID only
    this.doctorId = doctorId; // Reference by ID only
  }
}
```

**Note**: In the Rocket Medic implementation, some entities like Appointments and Examinations currently use direct references for educational purposes. In a production system with distributed transactions and scalability requirements, you should reference aggregates by ID and use repositories to retrieve them when needed.

### Rule 4: Use Eventual Consistency Between Aggregates

If a business rule spans multiple aggregates, use eventual consistency through domain events rather than modifying multiple aggregates in a single transaction.

### Rule 5: One Aggregate per Transaction

Modify only one aggregate instance per transaction. If you need to modify multiple aggregates, use domain events and eventual consistency.

## Rocket Medic Domain Model

Below is the entity model showing the relationships between the main domain objects:

![Rocket Medic Entity Model](architecture/images/entity-model.png)

---

## Aggregate Examples from Rocket Medic

### 1. Patient Aggregate

The **Patient** is an aggregate root that manages patient information, medical records, appointments, examinations, and allergies.

```javascript
class Patient {
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
    emergencyContact
  ) {
    // Aggregate Root Identity
    this.id = id;
    this.identificationDocument = identificationDocument;

    // Patient attributes
    this.name = name;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.bloodType = bloodType;

    // Value Objects
    this.address = address; // Address value object
    this.emergencyContact = emergencyContact; // EmergencyContact value object

    // Contact information
    this.phoneNumber = phoneNumber;
    this.email = email;

    // Internal collections (part of aggregate)
    this.allergies = []; // Allergy entities
    this.appointments = []; // Appointment references
    this.examinations = []; // Examination entities
    this.medicalRecord = new MedicalRecord(); // Internal entity
  }

  // Business logic to maintain invariants
  addAllergy(allergy) {
    if (!(allergy instanceof Allergy)) {
      throw new Error('Invalid allergy');
    }

    // Prevents duplicate allergies
    const hasAllergy = this.allergies.some((a) => a.equals(allergy));
    if (!hasAllergy) {
      this.allergies.push(allergy);
    }
  }

  addDiagnosis(description) {
    const diagnosis = new Diagnosis(description);
    this.medicalRecord.addDiagnosis(diagnosis);
  }

  scheduleAppointment(appointment) {
    if (!(appointment instanceof Appointment)) {
      throw new Error('Invalid appointment');
    }

    // Prevents scheduling conflicts
    const hasConflict = this.appointments.some((existingAppointment) =>
      appointment.hasConflict(existingAppointment)
    );

    if (!hasConflict) {
      this.appointments.push(appointment);
    } else {
      throw new Error('Appointment conflict detected');
    }
  }
}
```

**Invariants Protected by Patient Aggregate:**

- No duplicate allergies
- No conflicting appointments
- All medical records are properly initialized
- Patient identity is immutable

**Why Patient is an Aggregate:**

1. **Consistency Boundary**: Patient information, allergies, and appointments must remain consistent
2. **Transactional Unity**: Changes to a patient's medical data should be atomic
3. **Single Entry Point**: All modifications go through Patient methods
4. **Encapsulation**: Internal collections are protected from direct manipulation

---

### 2. Doctor Aggregate

The **Doctor** aggregate manages doctor information and their working hours.

![Doctor Working Hours Value Object](architecture/images/value-object-workingHours.png)

```javascript
class Doctor {
  constructor(id, rcm, name, specialty, phoneNumber) {
    // Aggregate Root Identity
    this.id = id;
    this.rcm = rcm; // Medical license number

    // Doctor attributes
    this.name = name;
    this.specialty = specialty; // Array of specialties
    this.phoneNumber = phoneNumber;

    // Internal value object
    this.workingHours = new WorkingHours();
  }

  addWorkingHours(day, timeSlot) {
    this.workingHours.addHours(day, timeSlot);
  }

  removeWorkingHours(day, timeSlot) {
    this.workingHours.removeHours(day, timeSlot);
  }

  listWorkingHours() {
    return this.workingHours.listHours();
  }
}
```

**Invariants Protected:**

- Working hours are managed consistently
- Doctor credentials (RCM) remain valid
- Specialty information is properly maintained

---

### 3. MedicalRecord as Internal Entity

The **MedicalRecord** is not a separate aggregate but an internal entity within the Patient aggregate. It manages diagnoses, treatments, and medications.

```javascript
class MedicalRecord {
  constructor() {
    this.diagnosis = [];
    this.treatments = [];
    this.medications = [];
  }

  addDiagnosis(diagnosis) {
    if (!(diagnosis instanceof Diagnosis)) {
      throw new Error('Invalid diagnosis');
    }
    this.diagnosis.push(diagnosis);
  }

  addTreatment(treatment) {
    if (!(treatment instanceof Treatment)) {
      throw new Error('Invalid treatment');
    }
    this.treatments.push(treatment);
  }

  addMedication(medication) {
    if (!(medication instanceof Medication)) {
      throw new Error('Invalid medication');
    }
    this.medications.push(medication);
  }
}
```

**Why MedicalRecord is NOT a separate aggregate:**

- It has no meaningful identity outside of a Patient
- It's always accessed through a Patient
- It shares the same lifecycle as the Patient
- Consistency is maintained at the Patient level

---

## Value Objects in Rocket Medic

### Address Value Object

![Address Value Object](architecture/images/value-object-address-emergencyContact.png)

```javascript
class Address {
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

### EmergencyContact Value Object

```javascript
class EmergencyContact {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
  }

  equals(otherContact) {
    return this.name === otherContact.name && this.phone === otherContact.phone;
  }
}
```

**Why these are Value Objects:**

- They're defined by their attributes, not identity
- Two addresses with the same values are considered equal
- They're immutable (changes create new instances)
- They have no lifecycle of their own

---

## Common Aggregate Patterns in Rocket Medic

### Pattern 1: Root with Value Objects

**Example**: Patient with Address and EmergencyContact

```javascript
const patient = new Patient(
  '1',
  '123.123.123-12',
  'John Doe',
  '1990-01-01',
  'Male',
  'O+',
  new Address('Main St', '123', 'City', 'State', '12345'),
  '+1234567890',
  'john@example.com',
  new EmergencyContact('Jane Doe', '+0987654321')
);
```

### Pattern 2: Root with Internal Entities

**Example**: Patient with MedicalRecord

The MedicalRecord is created within the Patient and managed through Patient methods.

### Pattern 3: Root with Collections

**Example**: Patient with allergies and appointments

Collections are encapsulated and modified only through aggregate methods.

---

## Identifying Aggregate Boundaries

When designing aggregates, ask:

1. **What must be consistent?**
   - Patient data with allergies and appointments
   - Doctor information with working hours

2. **What is the invariant?**
   - No duplicate allergies
   - No conflicting appointments
   - Valid medical records

3. **What is the lifecycle?**
   - Patient lifecycle includes their medical history
   - Doctor lifecycle includes their schedule

4. **What is the transaction boundary?**
   - All patient updates in one transaction
   - All doctor schedule changes in one transaction

---

## Anti-Patterns to Avoid

### ❌ Large Aggregates

Don't include too much in one aggregate:

```javascript
// Bad - Too much in one aggregate
class Hospital {
  patients = [];
  doctors = [];
  appointments = [];
  equipment = [];
  // This is too large!
}
```

### ❌ Direct References Between Aggregates

While our current implementation uses direct references for simplicity, in production you should reference by ID:

```javascript
// Current (simplified)
class Appointment {
  constructor(id, date, patient, doctor, reason, status, observations) {
    this.patient = patient; // Direct reference
    this.doctor = doctor; // Direct reference
  }
}

// Better for production
class Appointment {
  constructor(id, date, patientId, doctorId, reason, status, observations) {
    this.patientId = patientId; // Reference by ID
    this.doctorId = doctorId; // Reference by ID
  }
}
```

---

## Repositories: Centralizing Aggregate Persistence

### What is a Repository?

A **Repository** acts as a collection-like interface for accessing aggregate roots. It encapsulates the logic for retrieving and persisting aggregates, providing a clean separation between the domain model and data access concerns.

### Key Principles

1. **One Repository per Aggregate Root**: Only aggregate roots have repositories
2. **Collection Interface**: Repositories mimic in-memory collections
3. **Hide Persistence Details**: Domain code doesn't know about databases
4. **Query by Identity**: Primary method is `findById()`
5. **Domain-Specific Queries**: Add methods that make sense for the domain

### Base Repository Implementation

The Rocket Medic system implements a generic base repository that all specific repositories extend:

```javascript
export class Repository {
  constructor() {
    this.data = new Map(); // In-memory storage (would be DB in production)
  }

  add(id, entity) {
    if (this.data.has(id)) {
      throw new Error(`Entity with id ${id} already exists.`);
    }
    this.data.set(id, entity);
  }

  findById(id) {
    return this.data.get(id);
  }

  findAll() {
    return Array.from(this.data.values());
  }

  update(id, entity) {
    if (!this.data.has(id)) {
      throw new Error(`Entity with id ${id} does not exist.`);
    }
    this.data.set(id, entity);
  }

  delete(id) {
    if (!this.data.has(id)) {
      throw new Error(`Entity with id ${id} does not exist.`);
    }
    this.data.delete(id);
  }
}
```

**Key Design Decisions:**

- Uses `Map` for O(1) lookups by ID
- Throws explicit errors for invalid operations
- Provides CRUD operations as building blocks
- Can be easily swapped for database implementation

### Aggregate-Specific Repositories

Each aggregate root has its own repository with domain-specific query methods:

#### PatientRepository

```javascript
export class PatientRepository extends Repository {
  constructor() {
    super();
  }

  // Domain-specific query: Find patients by name
  findByName(name) {
    return this.findAll().filter((patient) => patient.name === name);
  }

  // Domain-specific query: Find patients by blood type
  findByBloodType(bloodType) {
    return this.findAll().filter((patient) => patient.bloodType === bloodType);
  }
}
```

**Usage Example:**

```javascript
const patientRepository = new PatientRepository();

// Add aggregate root
patientRepository.add(patient.id, patient);

// Retrieve by ID
const foundPatient = patientRepository.findById('1');

// Domain-specific queries
const oPositivePatients = patientRepository.findByBloodType('O+');
const johnsFound = patientRepository.findByName('John Doe');
```

#### DoctorRepository

```javascript
export class DoctorRepository extends Repository {
  constructor() {
    super();
  }

  // Find doctors by name
  findByName(name) {
    return this.findAll().filter((doctor) => doctor.name === name);
  }

  // Find doctors by specialization (domain-specific business logic)
  findBySpecialization(spec) {
    return this.findAll().filter((doctor) => doctor.specialty.includes(spec));
  }
}
```

**Usage Example:**

```javascript
const doctorRepository = new DoctorRepository();

doctorRepository.add(doctor.id, doctor);

// Find specialists
const cardiologists = doctorRepository.findBySpecialization('Cardiology');
```

#### AppointmentRepository

```javascript
export class AppointmentRepository extends Repository {
  constructor() {
    super();
  }

  // Find appointments for a specific patient
  findByPatientId(patientId) {
    return this.findAll().filter(
      (appointment) => appointment.patient.id === patientId
    );
  }

  // Find appointments for a specific doctor
  findByDoctorId(doctorId) {
    return this.findAll().filter(
      (appointment) => appointment.doctor.id === doctorId
    );
  }

  // Find appointments by status (Scheduled, Completed, Cancelled)
  findByStatus(status) {
    return this.findAll().filter(
      (appointment) => appointment.status === status
    );
  }
}
```

#### ExaminationRepository

```javascript
export class ExaminationRepository extends Repository {
  constructor() {
    super();
  }

  // Find all examinations for a patient
  findByPatientId(patientId) {
    return this.findAll().filter(
      (examination) => examination.patient.id === patientId
    );
  }

  // Find examinations by type (Blood Test, X-Ray, etc.)
  findByType(type) {
    return this.findAll().filter((examination) => examination.type === type);
  }

  // Find examinations by date
  findByDate(date) {
    return this.findAll().filter((examination) => examination.date === date);
  }
}
```

### Why Repositories Matter for Aggregates

#### 1. Enforce Aggregate Boundaries

Repositories only exist for aggregate roots, making boundaries explicit:

```javascript
// ✅ Correct - Repository for aggregate root
const patientRepository = new PatientRepository();
const patient = patientRepository.findById('1');

// ❌ Wrong - No repository for internal entity
// const medicalRecordRepository = new MedicalRecordRepository(); // Doesn't exist!
// Access MedicalRecord through Patient aggregate instead
const patient = patientRepository.findById('1');
const medicalRecord = patient.medicalRecord; // Through aggregate root
```

#### 2. Centralize Data Access Logic

All persistence logic is in one place, not scattered across the codebase:

```javascript
// Business logic in application service
function scheduleAppointment(appointmentData) {
  const patient = patientRepository.findById(appointmentData.patientId);
  const doctor = doctorRepository.findById(appointmentData.doctorId);

  const appointment = new Appointment(/* ... */);

  // Repository handles persistence
  appointmentRepository.add(appointment.id, appointment);
}
```

#### 3. Enable Testing and Mocking

Repositories can be easily mocked for testing:

```javascript
class MockPatientRepository extends Repository {
  constructor() {
    super();
    // Pre-populate with test data
    this.add('test-1', createTestPatient());
  }
}

// In tests
const testRepository = new MockPatientRepository();
const testPatient = testRepository.findById('test-1');
```

#### 4. Abstract Storage Implementation

The domain doesn't care if data is in memory, SQL, NoSQL, or external APIs:

```javascript
// Current: In-memory Map
class Repository {
  constructor() {
    this.data = new Map();
  }
}

// Future: Database implementation (same interface)
class Repository {
  constructor(database) {
    this.db = database;
  }

  async findById(id) {
    return await this.db.query('SELECT * FROM entities WHERE id = ?', [id]);
  }
}
```

### Repository Pattern Benefits

| Benefit                    | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| **Separation of Concerns** | Domain logic separate from data access                  |
| **Testability**            | Easy to mock and test in isolation                      |
| **Flexibility**            | Swap storage implementations without changing domain    |
| **Query Encapsulation**    | Complex queries hidden behind meaningful method names   |
| **Consistency**            | Consistent interface for all aggregate access           |
| **Domain Language**        | Methods use ubiquitous language (findByBloodType, etc.) |

### Repository Usage Patterns

#### Pattern 1: Simple CRUD Operations

```javascript
const patientRepository = new PatientRepository();

// Create
const patient = new Patient(/* ... */);
patientRepository.add(patient.id, patient);

// Read
const found = patientRepository.findById('1');

// Update
found.phoneNumber = '+9876543210';
patientRepository.update(found.id, found);

// Delete
patientRepository.delete('1');
```

#### Pattern 2: Domain-Specific Queries

```javascript
// Business use case: Find all cardiologists available today
const cardiologists = doctorRepository.findBySpecialization('Cardiology');
const availableDoctors = cardiologists.filter((doctor) =>
  doctor.workingHours.isAvailable(new Date())
);
```

#### Pattern 3: Cross-Aggregate Queries

```javascript
// Find all scheduled appointments for a patient
const patient = patientRepository.findById('1');
const appointments = appointmentRepository.findByPatientId(patient.id);
const scheduled = appointments.filter((apt) => apt.status === 'Scheduled');
```

### When NOT to Use Repositories

**Don't create repositories for:**

1. **Value Objects** - They have no identity, pass them around directly
2. **Internal Entities** - Access through aggregate root
3. **DTOs** - Data transfer objects are not domain objects
4. **Utility Classes** - Only domain aggregates need repositories

```javascript
// ❌ Wrong - Value objects don't need repositories
// const addressRepository = new AddressRepository(); // NO!

// ❌ Wrong - Internal entities accessed through aggregate
// const medicalRecordRepository = new MedicalRecordRepository(); // NO!

// ✅ Correct - Aggregate roots have repositories
const patientRepository = new PatientRepository(); // YES!
const doctorRepository = new DoctorRepository(); // YES!
```

### Repository Evolution

As your system grows, repositories can evolve:

```javascript
// Phase 1: Simple in-memory (current)
class PatientRepository extends Repository {
  // Uses Map internally
}

// Phase 2: Add caching
class PatientRepository extends Repository {
  constructor(cache) {
    super();
    this.cache = cache;
  }

  findById(id) {
    return this.cache.getOrSet(id, () => super.findById(id));
  }
}

// Phase 3: Add async database
class PatientRepository extends Repository {
  async findById(id) {
    return await this.db.patients.findOne({ id });
  }
}

// Phase 4: Add domain events
class PatientRepository extends Repository {
  add(id, patient) {
    super.add(id, patient);
    eventBus.publish(new PatientCreatedEvent(patient));
  }
}
```

---

## Best Practices

1. **Start Small**: Begin with smaller aggregates (Patient, Doctor) rather than one large Hospital aggregate
2. **Think Transactions**: Each aggregate is a transaction boundary
3. **Protect Invariants**: Focus on business rules that must always be true
4. **Use Value Objects**: Separate identity-less concepts into value objects
5. **Repository per Aggregate Root**: Only create repositories for aggregate roots, never for internal entities
6. **Domain-Specific Queries**: Add repository methods that use ubiquitous language
7. **Test Invariants**: Ensure aggregate methods properly protect business rules
8. **Document Boundaries**: Make it clear why something is or isn't part of an aggregate
9. **Keep Repositories Simple**: Repositories retrieve and persist, business logic stays in aggregates
10. **Use Repositories Consistently**: Always access aggregates through repositories, never direct instantiation in production code

---

## Summary

In the Rocket Medic domain:

### Aggregates

- **Patient** and **Doctor** are separate aggregates with clear boundaries
- **MedicalRecord** is an internal entity within Patient aggregate
- **Address**, **EmergencyContact**, and **WorkingHours** are value objects
- **Appointments** and **Examinations** have their own repositories as they can exist independently
- Each aggregate protects its own invariants and consistency rules

### Repositories

- **PatientRepository**: Manages Patient aggregate persistence with domain queries like `findByBloodType()`
- **DoctorRepository**: Handles Doctor aggregate with queries like `findBySpecialization()`
- **AppointmentRepository**: Manages appointments with queries by patient, doctor, and status
- **ExaminationRepository**: Handles examinations with queries by patient, type, and date
- All repositories extend the base `Repository` class providing consistent CRUD operations
- Repositories provide a collection-like interface hiding persistence details
- No repositories exist for internal entities (MedicalRecord) or value objects (Address)

Understanding and properly implementing aggregates with repositories is crucial for building maintainable, scalable domain-driven systems. The repository pattern centralizes data access, enforces aggregate boundaries, and allows the domain model to remain focused on business logic rather than persistence concerns.
