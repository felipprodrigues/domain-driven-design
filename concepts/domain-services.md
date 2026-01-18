# Domain Services: Orchestrating Business Logic

## What is a Domain Service?

A **Domain Service** (also called Application Service) is a stateless object that orchestrates business operations across multiple domain objects. Services abstract complex workflows and coordinate interactions between entities, value objects, and repositories.

## Key Characteristics

1. **Stateless**: Services don't hold state; they operate on domain objects
2. **Orchestration**: Coordinate operations across multiple aggregates
3. **Business Logic**: Contain operations that don't naturally belong to an entity
4. **Repository Coordination**: Manage interactions with repositories
5. **Transaction Boundaries**: Define where transactions begin and end

## When to Use Domain Services

Use a service when:

- An operation involves multiple aggregates
- Logic doesn't naturally belong to a single entity
- You need to coordinate repository operations
- Business workflow spans several domain objects
- You want to keep controllers/UI layer thin

## Services vs Entities vs Repositories

| Aspect             | Entity                      | Repository                | Service                         |
| ------------------ | --------------------------- | ------------------------- | ------------------------------- |
| **Purpose**        | Represent domain concepts   | Persist/retrieve entities | Orchestrate business operations |
| **State**          | Has state (attributes)      | Manages storage state     | Stateless                       |
| **Responsibility** | Business rules & invariants | Data access               | Workflow coordination           |
| **Lifecycle**      | Created, modified, deleted  | Singleton/per-request     | Created per operation           |
| **Example**        | Patient, Doctor             | PatientRepository         | PatientService                  |

---

## Rocket Medic Domain Services

### Architecture Flow

```
Controller/UI Layer
       ↓
   Services
       ↓
┌──────┴──────┐
↓             ↓
Entities  Repositories
↓             ↓
Value Objects  Storage
```

### 1. PatientService

The **PatientService** orchestrates all patient-related operations, abstracting complex workflows from the core Patient entity.

```javascript
export class PatientService {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  // Create patient with validation
  addPatient(patientData) {
    const patient = new Patient(
      patientData.id,
      patientData.identificationDocument,
      patientData.name,
      patientData.dateOfBirth,
      patientData.gender,
      patientData.bloodType,
      patientData.address,
      patientData.phoneNumber,
      patientData.email,
      patientData.emergencyContact
    );

    this.patientRepository.add(patient.id, patient);
    return patient;
  }

  // Query operations
  findPatientById(patientId) {
    return this.patientRepository.findById(patientId);
  }

  findAllPatients() {
    return this.patientRepository.findAll();
  }

  findPatientByBloodType(bloodType) {
    return this.patientRepository.findByBloodType(bloodType);
  }

  // Update workflow
  updatePatient(patientId, updatedData) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    Object.assign(patient, updatedData);
    this.patientRepository.update(patientId, patient);
    return patient;
  }

  // Delete workflow
  deletePatient(patientId) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    this.patientRepository.delete(patient.id);
    return patient;
  }

  // Complex business operation: Add allergy
  addPatientAllergy(patientId, allergy) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    if (!(allergy instanceof Allergy)) {
      throw new Error('Invalid allergy');
    }

    const hasAllergy = patient.allergies.some((a) => a.equals(allergy));

    if (!hasAllergy) {
      patient.allergies.push(allergy);
      console.log(`Allergy ${allergy.type} added to patient ${patient.name}`);
    } else {
      console.log(`Allergy already exists for patient ${patient.name}`);
    }

    this.updatePatient(patientId, patient);
    return patient;
  }

  // Coordinate with MedicalRecord entity
  addPatientDiagnosis(patientId, diagnosis) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.medicalRecord.addDiagnosis(diagnosis);
    this.updatePatient(patientId, patient);
    return patient;
  }
}
```

#### What PatientService Abstracts:

1. **Entity Creation**: Handles complex Patient instantiation
2. **Validation**: Checks if patient exists before operations
3. **Repository Coordination**: Manages when to add/update/delete
4. **Error Handling**: Provides meaningful error messages
5. **Persistence Logic**: Decides when changes need to be saved
6. **Business Workflows**: Coordinates multi-step operations

#### Usage Example:

```javascript
// Without Service (direct manipulation - BAD)
const patient = new Patient(/* many parameters */);
patientRepository.add(patient.id, patient);
const foundPatient = patientRepository.findById('1');
foundPatient.allergies.push(new Allergy('Penicillin'));
patientRepository.update(foundPatient.id, foundPatient);

// With Service (clean abstraction - GOOD)
const patientService = new PatientService(patientRepository);
const patient = patientService.addPatient(patientData);
patientService.addPatientAllergy('1', new Allergy('Penicillin'));
```

---

### 2. DoctorService

The **DoctorService** manages doctor-related operations and working hours coordination.

```javascript
export class DoctorService {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  addDoctor(doctorData) {
    const doctor = new Doctor(
      doctorData.id,
      doctorData.rcm,
      doctorData.name,
      doctorData.specialty,
      doctorData.phoneNumber
    );

    this.doctorRepository.add(doctor.id, doctor);
    return doctor;
  }

  findDoctorById(doctorId) {
    return this.doctorRepository.findById(doctorId);
  }

  findAllDoctors() {
    return this.doctorRepository.findAll();
  }

  updateDoctor(doctorId, updatedData) {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    Object.assign(doctor, updatedData);
    this.doctorRepository.update(doctorId, doctor);
    return doctor;
  }

  deleteDoctor(doctorId) {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    this.doctorRepository.delete(doctor.id);
    return doctor;
  }

  // Business operation: Manage working hours
  addDoctorWorkingHours(doctorId, day, timeSlot) {
    const doctor = this.findDoctorById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const hasWorkingHours = doctor.workingHours.hours.some(
      (workingHour) =>
        workingHour.day === day && workingHour.timeSlot === timeSlot
    );

    if (hasWorkingHours) {
      throw new Error('Working hours already exists for this doctor');
    }

    doctor.addWorkingHours(day, timeSlot);
    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  // Business operation: Manage specialties
  addDoctorSpecialty(doctorId, specialty) {
    const doctor = this.findDoctorById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    if (doctor.specialties.includes(specialty)) {
      throw new Error('Specialty already exists');
    }

    doctor.specialties.push(specialty);
    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }
}
```

#### What DoctorService Abstracts:

1. **Doctor Creation**: Encapsulates complex instantiation
2. **Working Hours Management**: Coordinates availability logic
3. **Specialty Management**: Handles specialty validation and updates
4. **Repository Operations**: Manages persistence timing

---

### 3. ExaminationService

The **ExaminationService** manages examination scheduling and retrieval.

```javascript
export class ExaminationService {
  constructor(examinationRepository) {
    this.examinationRepository = examinationRepository;
  }

  scheduleExamination(examinationData) {
    const exam = new Examinations(
      examinationData.id,
      examinationData.type,
      examinationData.result,
      examinationData.date,
      examinationData.local,
      examinationData.responsibleDoctor,
      examinationData.patient
    );

    this.examinationRepository.add(exam.id, exam);
    return exam;
  }

  findExamById(examId) {
    return this.examinationRepository.findById(examId);
  }

  findExamByPatientId(patientId) {
    return this.examinationRepository.findByPatientId(patientId);
  }

  findExamByType(type) {
    return this.examinationRepository.findByType(type);
  }

  updateExam(examId, updatedData) {
    const exam = this.findExamById(examId);
    if (!exam) {
      throw new Error('Examination not found');
    }

    Object.assign(exam, updatedData);
    this.examinationRepository.update(examId, exam);
    return exam;
  }

  deleteExam(examId) {
    const exam = this.findExamById(examId);
    if (!exam) {
      throw new Error('Examination not found');
    }

    this.examinationRepository.delete(examId);
    return exam;
  }
}
```

---

## Benefits of Using Services

### 1. Separation of Concerns

**Without Service:**

```javascript
// Controller/UI has business logic (BAD)
function createPatient(req, res) {
  const patient = new Patient(/* ... */);
  const repository = new PatientRepository();
  repository.add(patient.id, patient);

  // Business logic mixed with presentation
  if (patient.bloodType === 'O+') {
    sendNotification('New O+ donor available');
  }
}
```

**With Service:**

```javascript
// Controller delegates to service (GOOD)
function createPatient(req, res) {
  const patientService = new PatientService(patientRepository);
  const patient = patientService.addPatient(req.body);
  res.json(patient);
}

// Business logic in service
class PatientService {
  addPatient(patientData) {
    const patient = new Patient(/* ... */);
    this.patientRepository.add(patient.id, patient);

    if (patient.bloodType === 'O+') {
      this.notifyOrganization(patient);
    }

    return patient;
  }
}
```

### 2. Testability

Services are easy to test in isolation:

```javascript
// Mock repository for testing
class MockPatientRepository {
  add(id, patient) {
    this.patients.set(id, patient);
  }
  findById(id) {
    return this.patients.get(id);
  }
}

// Test the service
describe('PatientService', () => {
  it('should add patient allergy', () => {
    const mockRepo = new MockPatientRepository();
    const service = new PatientService(mockRepo);

    const patient = service.addPatient(patientData);
    service.addPatientAllergy(patient.id, new Allergy('Penicillin'));

    const updatedPatient = service.findPatientById(patient.id);
    expect(updatedPatient.allergies).toHaveLength(1);
  });
});
```

### 3. Reusability

Services provide reusable business operations:

```javascript
// Use same service in multiple contexts
const patientService = new PatientService(patientRepository);

// Web API endpoint
app.post('/patients', (req, res) => {
  const patient = patientService.addPatient(req.body);
  res.json(patient);
});

// Batch import
function importPatients(patientsList) {
  patientsList.forEach((patientData) => {
    patientService.addPatient(patientData);
  });
}

// CLI command
program.command('add-patient').action((options) => {
  patientService.addPatient(options);
});
```

### 4. Transaction Management

Services define clear transaction boundaries:

```javascript
class AppointmentService {
  scheduleAppointment(appointmentData) {
    // Transaction starts
    try {
      const patient = this.patientRepository.findById(
        appointmentData.patientId
      );
      const doctor = this.doctorRepository.findById(appointmentData.doctorId);

      // Validate availability
      if (!doctor.isAvailable(appointmentData.date)) {
        throw new Error('Doctor not available');
      }

      // Create appointment
      const appointment = new Appointment(/* ... */);
      this.appointmentRepository.add(appointment.id, appointment);

      // Update patient
      patient.appointments.push(appointment);
      this.patientRepository.update(patient.id, patient);

      // Commit transaction
      return appointment;
    } catch (error) {
      // Rollback transaction
      throw error;
    }
  }
}
```

### 5. Dependency Injection

Services use dependency injection for flexibility:

```javascript
// Easy to swap implementations
class PatientService {
  constructor(patientRepository, notificationService, auditService) {
    this.patientRepository = patientRepository;
    this.notificationService = notificationService;
    this.auditService = auditService;
  }

  addPatient(patientData) {
    const patient = new Patient(/* ... */);
    this.patientRepository.add(patient.id, patient);

    // Optional services can be injected
    if (this.notificationService) {
      this.notificationService.notifyNewPatient(patient);
    }

    if (this.auditService) {
      this.auditService.log('Patient created', patient.id);
    }

    return patient;
  }
}

// Production
const service = new PatientService(
  new DatabaseRepository(),
  new EmailNotificationService(),
  new AuditLogger()
);

// Testing
const testService = new PatientService(
  new MockRepository(),
  null, // No notifications in tests
  null // No audit in tests
);
```

---

## Service Patterns in Rocket Medic

### Pattern 1: CRUD Operations

```javascript
// Standard create, read, update, delete
addPatient(data); // Create
findPatientById(id); // Read
updatePatient(id, data); // Update
deletePatient(id); // Delete
```

### Pattern 2: Domain-Specific Operations

```javascript
// Business operations that make sense in the domain
addPatientAllergy(patientId, allergy);
addPatientDiagnosis(patientId, diagnosis);
addDoctorWorkingHours(doctorId, day, timeSlot);
scheduleExamination(examinationData);
```

### Pattern 3: Query Operations

```javascript
// Delegate to repository queries
findPatientByBloodType(bloodType);
findDoctorBySpecialization(specialty);
findExamByPatientId(patientId);
```

### Pattern 4: Validation and Error Handling

```javascript
operationName(params) {
  // 1. Validate input
  const entity = this.repository.findById(id);
  if (!entity) {
    throw new Error('Entity not found');
  }

  // 2. Perform operation
  entity.doSomething(params);

  // 3. Persist changes
  this.repository.update(id, entity);

  // 4. Return result
  return entity;
}
```

---

## Best Practices

1. **Keep Services Thin**: Don't put business logic in services if it belongs in entities
2. **Stateless Design**: Services shouldn't hold state between operations
3. **Single Responsibility**: One service per aggregate or related operations
4. **Use Dependency Injection**: Pass repositories through constructor
5. **Return Domain Objects**: Don't return repository-specific objects
6. **Handle Errors Consistently**: Use meaningful error messages
7. **Document Workflows**: Comment complex multi-step operations
8. **Test Services Thoroughly**: Services are the perfect testing boundary

---

## Services vs Entities: Where Does Logic Go?

### Put Logic in Entities When:

- It's about a single entity's state or behavior
- It protects an invariant
- It's a domain rule about that entity

```javascript
// Entity method (GOOD)
class Patient {
  addAllergy(allergy) {
    if (this.allergies.some((a) => a.equals(allergy))) {
      throw new Error('Allergy already exists');
    }
    this.allergies.push(allergy);
  }
}
```

### Put Logic in Services When:

- It involves multiple entities
- It coordinates repositories
- It's a workflow or process
- It doesn't naturally belong to any entity

```javascript
// Service method (GOOD)
class AppointmentService {
  scheduleAppointment(patientId, doctorId, date) {
    const patient = this.patientRepository.findById(patientId);
    const doctor = this.doctorRepository.findById(doctorId);

    // Coordinates two aggregates - belongs in service
    if (!doctor.isAvailable(date)) {
      throw new Error('Doctor not available');
    }

    const appointment = new Appointment(patient, doctor, date);
    this.appointmentRepository.add(appointment.id, appointment);
    return appointment;
  }
}
```

---

## Summary

### Domain Services in Rocket Medic:

- **PatientService**: Orchestrates patient creation, updates, and medical record management
- **DoctorService**: Manages doctors, working hours, and specialties
- **ExaminationService**: Handles examination scheduling and queries

### Key Takeaways:

1. Services abstract complex workflows from entities
2. They coordinate operations across repositories and aggregates
3. Services are stateless and use dependency injection
4. They provide clean separation between UI/API and domain logic
5. Services define transaction boundaries
6. They make code more testable and maintainable

By using domain services, the Rocket Medic system keeps entities focused on business rules while services handle orchestration, making the codebase cleaner and more maintainable.
