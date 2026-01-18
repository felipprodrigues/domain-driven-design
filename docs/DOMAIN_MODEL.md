# Domain Model

> Comprehensive guide to the Rocket Medic domain model and business rules

## 🏥 Domain Overview

Rocket Medic is a simplified healthcare management system focused on:

- Patient management
- Doctor scheduling
- Appointment booking
- Medical record tracking
- Examination results

## 📊 Domain Model Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ROCKET MEDIC DOMAIN                      │
└─────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
     ┌─────▼─────┐                   ┌────▼─────┐
     │  PATIENT  │                   │  DOCTOR  │
     │ AGGREGATE │                   │ AGGREGATE│
     └─────┬─────┘                   └────┬─────┘
           │                              │
           │ owns                   has   │
           │                              │
   ┌───────┼────────────────┐        ┌───▼────────┐
   │       │                │        │ Working    │
   ▼       ▼                ▼        │ Hours      │
┌────┐  ┌────────┐    ┌─────────┐  └────────────┘
│Med │  │Allergy │    │Address  │
│Rec │  └────────┘    │Emergency│
└─┬──┘                │Contact  │
  │                   └─────────┘
  │ contains
  │
  ├─► Diagnosis
  ├─► Treatment
  └─► Medication
```

## 🎯 Aggregates

### 1. Patient Aggregate

**Root Entity**: Patient
**Aggregate Boundary**: Patient + Medical Record + Allergies

#### Responsibilities

- Manage patient personal information
- Maintain medical history
- Control access to medical records
- Enforce business rules for patient data

#### Invariants (Business Rules)

1. Patient must have valid identification document
2. No duplicate allergies
3. Medical record is always initialized
4. Contact information must be valid
5. Emergency contact is required for minors

#### Key Operations

```javascript
// Creation
const patient = new Patient(
  id, // Unique identifier
  identificationDocument, // CPF, SSN, etc.
  name,
  dateOfBirth,
  gender,
  bloodType,
  address, // Value Object
  phoneNumber,
  email,
  emergencyContact // Value Object
);

// Managing Medical Information
patient.addAllergy(allergy);
patient.addDiagnosis(description);
patient.addTreatment(description);
patient.addMedication(medication);

// Appointments
patient.scheduleAppointment(appointment);
patient.cancelAppointment(appointmentId);

// Examinations
patient.addExamination(examination);
```

#### Internal Entities

**MedicalRecord**

- Owned by Patient
- Contains: diagnoses, treatments, medications
- Immutable history (audit trail)

**Allergy**

- Part of patient's medical record
- Prevents duplicate allergies
- Critical for treatment decisions

### 2. Doctor Aggregate

**Root Entity**: Doctor
**Aggregate Boundary**: Doctor + Working Hours + Specialties

#### Responsibilities

- Manage doctor professional information
- Control availability schedule
- Maintain specialty certifications

#### Invariants (Business Rules)

1. Doctor must have valid medical registration (CRM)
2. Working hours cannot overlap
3. At least one specialty required
4. Contact information must be valid

#### Key Operations

```javascript
// Creation
const doctor = new Doctor(
  id,
  registrationNumber, // CRM, medical license
  name,
  specialties, // Array of specialties
  phoneNumber
);

// Managing Availability
doctor.workingHours.hours.push({
  day: 'Monday',
  timeSlot: '09:00 AM - 05:00 PM',
});

// Managing Specialties
doctor.addSpecialty('Cardiology');
```

## 📦 Entities

### Appointment

**Identity**: Unique appointment ID
**Lifecycle**: Independent of Patient/Doctor aggregates
**Status**: Scheduled, Confirmed, Completed, Cancelled

```javascript
const appointment = new Appointment(
  id,
  dateTime,
  patient, // Reference to Patient
  doctor, // Reference to Doctor
  reason,
  status,
  notes
);
```

**Business Rules**:

- Cannot be scheduled in the past
- Doctor must be available at requested time
- Patient cannot have overlapping appointments
- Requires 24-hour notice for cancellation

### Examination

**Identity**: Unique examination ID
**Part of**: Patient's medical history

```javascript
const examination = new Examinations(
  id,
  type, // 'Blood Test', 'X-Ray', etc.
  result,
  date,
  location,
  responsibleDoctor,
  patient
);
```

**Business Rules**:

- Must be ordered by a doctor
- Results are immutable once recorded
- Linked to specific patient

### Medication

**Part of**: Medical Record
**Properties**: Name, dosage, frequency, duration

```javascript
const medication = new Medication(name, dosage, frequency, startDate, endDate);
```

## 💎 Value Objects

### Address

**Properties**: street, number, city, state, zipCode
**Immutable**: Yes
**Equality**: By value comparison

```javascript
const address = new Address('Main Street', '123', 'Springfield', 'IL', '62701');

// Value objects are compared by value
address1.equals(address2); // true if all properties match
```

### EmergencyContact

**Properties**: name, phone
**Purpose**: Critical contact information

```javascript
const contact = new EmergencyContact('Jane Doe', '+1-555-0123');
```

### WorkingHours

**Properties**: Array of day/timeSlot pairs
**Purpose**: Doctor availability schedule

```javascript
const workingHours = new WorkingHours();
workingHours.hours.push({
  day: 'Monday',
  timeSlot: '09:00 AM - 05:00 PM',
});
```

## 🔧 Domain Services

### DoctorService

**Purpose**: CRUD operations for doctors
**Operations**:

- `addDoctor(doctorData)`
- `findDoctorById(id)`
- `findAllDoctors()`
- `updateDoctor(id, data)`
- `deleteDoctor(id)`

### PatientService

**Purpose**: CRUD operations for patients
**Operations**:

- `addPatient(patientData)`
- `findPatientById(id)`
- `findAllPatients()`
- `findPatientByName(name)`
- `findPatientByBloodType(bloodType)`
- `updatePatient(id, data)`
- `deletePatient(id)`

### DoctorAvailabilityService

**Purpose**: Complex availability checking logic
**Key Method**: `isDoctorAvailable(doctorId, dateTime)`

**Algorithm**:

1. Check if doctor exists
2. Verify date/time is valid
3. Check for appointment conflicts
4. Verify time falls within working hours
5. Return availability status

**Business Rules**:

- Doctor must have working hours defined
- Cannot have overlapping appointments
- Must respect configured schedule

### AppointmentService (Application Service)

**Purpose**: Orchestrates appointment booking use case
**Coordinates**: Patient, Doctor, Availability, Notifications

**Flow**:

1. Validate patient exists
2. Validate doctor exists
3. Check doctor availability
4. Check patient schedule
5. Create appointment
6. Send notification
7. Return confirmation

## 📋 Business Rules Summary

### Patient Rules

- ✅ Unique identification document
- ✅ Valid contact information
- ✅ No duplicate allergies
- ✅ Medical record always exists
- ✅ Emergency contact for minors

### Doctor Rules

- ✅ Valid medical registration
- ✅ At least one specialty
- ✅ No overlapping working hours
- ✅ Valid contact information

### Appointment Rules

- ✅ Future dates only
- ✅ Doctor must be available
- ✅ No patient conflicts
- ✅ Within doctor's working hours
- ✅ 24-hour cancellation notice

### Examination Rules

- ✅ Must have doctor authorization
- ✅ Results are immutable
- ✅ Linked to patient record
- ✅ Date cannot be in future

## 🔄 Domain Events (Future Enhancement)

Potential events to implement:

- `PatientRegistered`
- `AppointmentScheduled`
- `AppointmentCancelled`
- `ExaminationCompleted`
- `AllergyRecorded`
- `TreatmentStarted`

## 🎓 Ubiquitous Language

| Term               | Definition                                    |
| ------------------ | --------------------------------------------- |
| **Aggregate**      | Cluster of domain objects treated as a unit   |
| **Entity**         | Object with unique identity                   |
| **Value Object**   | Object defined by its attributes, no identity |
| **Repository**     | Abstraction for data access                   |
| **Domain Service** | Business logic that doesn't fit in an entity  |
| **Invariant**      | Rule that must always be true                 |
| **Aggregate Root** | Entry point to an aggregate                   |

## 📚 Related Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Implementation Details](../IMPLEMENTATION_SUMMARY.md)
- [API Documentation](API.md)
