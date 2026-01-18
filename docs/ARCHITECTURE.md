# Project Architecture

> Detailed technical architecture of the Rocket Medic system

## 🏗️ Architectural Style

This project implements **Hexagonal Architecture** (also known as Ports and Adapters), combined with **Domain-Driven Design** tactical patterns.

### Key Principles

1. **Domain Independence**: Core business logic has no external dependencies
2. **Dependency Inversion**: Dependencies point inward toward the domain
3. **Interface Segregation**: Clear boundaries between layers
4. **Single Responsibility**: Each layer has distinct responsibilities

## 📁 Directory Structure

```
src/
├── domain/                     # 🎯 Core Domain Layer (Pure Business Logic)
│   ├── entities/              # Domain entities with identity
│   │   ├── doctor.js          # Doctor aggregate root
│   │   ├── patient.js         # Patient aggregate root
│   │   ├── appointment.js     # Appointment entity
│   │   ├── examinations.js    # Examination entity
│   │   ├── medication.js      # Medication entity
│   │   └── record/            # Medical record entities
│   │       ├── allergy.js
│   │       ├── diagnosis.js
│   │       ├── treatment.js
│   │       └── medicalRecord.js
│   ├── value-objects/         # Immutable value objects
│   │   ├── address.js
│   │   ├── emergencyContact.js
│   │   └── workingHours.js
│   ├── services/              # Domain services (complex business rules)
│   │   ├── doctor-service/
│   │   │   ├── doctorService.js
│   │   │   ├── doctorAvailabilityService.js
│   │   │   ├── doctorWorkingHoursService.js
│   │   │   └── doctorSpecialtyService.js
│   │   ├── patientService.js
│   │   └── examinationService.js
│   └── repositories/          # Repository interfaces
│       └── repository.js      # Base repository interface
│
├── application/               # 🎮 Application Layer (Use Cases)
│   └── services/
│       └── AppointmentService.js  # Orchestrates appointment booking
│
├── infrastructure/            # 🔧 Infrastructure Layer (Technical Concerns)
│   ├── persistance/          # Data persistence implementations
│   │   ├── doctorRepository.js
│   │   ├── patientRepository.js
│   │   ├── appointmentRepository.js
│   │   └── examinationRepository.js
│   └── notification/         # External communication
│       └── notificationService.js
│
└── interfaces/               # 🌐 Interface Layer (Entry Points)
    ├── controllers/          # HTTP request handlers
    │   ├── doctor-controllers/
    │   │   ├── doctorController.js
    │   │   ├── doctorAvailabilityController.js
    │   │   ├── doctorWorkingHoursController.js
    │   │   └── doctorSpecialtyController.js
    │   ├── patientController.js
    │   └── appointmentController.js
    ├── routes/               # API route definitions
    │   └── apiRoutes.js
    └── main.js               # Application bootstrap
```

## 🎯 Layer Responsibilities

### Domain Layer (Core)

**Purpose**: Contains all business logic and rules
**Dependencies**: None (pure business logic)
**Exports**: Entities, Value Objects, Domain Services, Repository interfaces

#### Entities

- Have unique identity
- Contain business logic
- Maintain invariants
- Examples: Patient, Doctor, Appointment

#### Value Objects

- No unique identity
- Immutable
- Compared by value
- Examples: Address, WorkingHours, EmergencyContact

#### Domain Services

- Business logic that doesn't belong to a single entity
- Operates on multiple aggregates
- Examples: DoctorAvailabilityService, AppointmentService

### Application Layer

**Purpose**: Orchestrates use cases and coordinates domain objects
**Dependencies**: Domain layer only
**Exports**: Application services

- Implements use cases
- Coordinates domain objects
- Manages transactions
- Example: AppointmentService coordinates Patient, Doctor, and scheduling

### Infrastructure Layer

**Purpose**: Implements technical concerns
**Dependencies**: Domain layer (implements interfaces)
**Exports**: Concrete implementations

- Repository implementations (in-memory, database)
- External service integrations
- File I/O
- Email/SMS notifications

### Interface Layer

**Purpose**: Exposes application to external world
**Dependencies**: Application and Domain layers
**Exports**: REST API, CLI, etc.

- HTTP controllers
- Request/Response DTOs
- Route definitions
- Input validation

## 🔄 Dependency Flow

```
┌─────────────────────────────────────────────┐
│         Interfaces (HTTP/REST)              │
│  Controllers, Routes, Request Handlers      │
└────────────────┬────────────────────────────┘
                 │ depends on
                 ↓
┌─────────────────────────────────────────────┐
│         Application Services                │
│    Use Cases, Workflow Orchestration        │
└────────────────┬────────────────────────────┘
                 │ depends on
                 ↓
┌─────────────────────────────────────────────┐
│         Domain Layer (Core)                 │
│  Entities, Value Objects, Domain Services   │
│  Repository Interfaces                      │
└────────────────▲────────────────────────────┘
                 │ implements
                 │
┌────────────────┴────────────────────────────┐
│         Infrastructure                      │
│  Repository Implementations, External APIs  │
└─────────────────────────────────────────────┘
```

## 🚀 Request Flow

Example: Scheduling an appointment

```
1. HTTP Request
   │
   ↓
2. Controller (interfaces/controllers/appointmentController.js)
   │ - Validates request
   │ - Extracts data
   ↓
3. Application Service (application/services/AppointmentService.js)
   │ - Orchestrates use case
   │ - Coordinates domain objects
   ↓
4. Domain Services
   │ - PatientService.findById()
   │ - DoctorService.findById()
   │ - DoctorAvailabilityService.isDoctorAvailable()
   ↓
5. Domain Entities
   │ - Validates business rules
   │ - Maintains invariants
   ↓
6. Repository
   │ - Persists data
   │
7. Notification Service
   │ - Sends email confirmation
   ↓
8. HTTP Response
```

## 🔐 Design Patterns Used

### Domain Layer

- **Aggregate Pattern**: Patient and Doctor aggregates
- **Value Object Pattern**: Address, EmergencyContact, WorkingHours
- **Repository Pattern**: Data access abstraction
- **Domain Service Pattern**: Complex business rules

### Application Layer

- **Service Pattern**: Use case orchestration
- **Facade Pattern**: Simplified interface to complex subsystems

### Infrastructure Layer

- **Repository Pattern Implementation**: In-memory storage
- **Adapter Pattern**: External service integration

### Interface Layer

- **Controller Pattern**: HTTP request handling
- **Router Pattern**: URL to handler mapping
- **Middleware Pattern**: Request/response processing

## 📊 Data Flow

### Write Operations

```
Client → Controller → App Service → Domain Service → Entity → Repository → Storage
```

### Read Operations

```
Client → Controller → Domain Service → Repository → Storage
                    ↓
              Transform to DTO
```

## 🎨 Design Decisions

### Why Hexagonal Architecture?

1. **Testability**: Domain logic can be tested without external dependencies
2. **Flexibility**: Easy to swap implementations (e.g., database, notification service)
3. **Maintainability**: Clear separation of concerns
4. **Domain Focus**: Core business logic is protected and isolated

### Why In-Memory Repository?

For educational purposes, we use in-memory storage to:

- Simplify setup (no database required)
- Focus on DDD patterns, not infrastructure
- Make testing easier
- Allow quick prototyping

In production, replace with:

- PostgreSQL/MySQL with Prisma or TypeORM
- MongoDB with Mongoose
- Any other persistence solution

### Why ES6 Modules?

- Native JavaScript support
- No transpilation needed
- Clear import/export syntax
- Modern Node.js standard

## 🔄 Extending the Architecture

### Adding a New Feature

1. **Domain**: Create entities, value objects, services
2. **Application**: Create application service for use case
3. **Infrastructure**: Implement repository if needed
4. **Interface**: Create controller and routes

### Adding a New Bounded Context

Create separate folder structure:

```
src/
├── domain/
│   ├── patient-management/  # Existing context
│   └── billing/             # New context
```

## 📚 Further Reading

- [Hexagonal Architecture](../concepts/architecture/hexagonal-architecture.md)
- [Domain Model Details](DOMAIN_MODEL.md)
- [API Documentation](API.md)
