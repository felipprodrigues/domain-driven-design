# API Documentation

> REST API reference for Rocket Medic system

## 🌐 Base URL

```
http://localhost:3000
```

## 🔧 Running the Server

```bash
# Start the server
npm start

# Server will be available at http://localhost:3000
# Health check at http://localhost:3000/health
```

## 📋 API Endpoints

### Health Check

#### Get Server Health

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "message": "API is running"
}
```

---

## 👨‍⚕️ Doctor Endpoints

### List All Doctors

```http
GET /api/doctors
```

**Response:**

```json
[
  {
    "id": "101",
    "rcm": "CRM12345",
    "name": "Smith",
    "specialty": ["Cardiology", "General Medicine"],
    "phoneNumber": "+1122334455",
    "workingHours": {
      "hours": [
        {
          "day": "Monday",
          "timeSlot": "09:00 AM - 05:00 PM"
        }
      ]
    }
  }
]
```

### Get Doctor by ID

```http
GET /api/doctors/:id
```

**Parameters:**

- `id` (path) - Doctor ID

**Response:**

```json
{
  "id": "101",
  "rcm": "CRM12345",
  "name": "Smith",
  "specialty": ["Cardiology"],
  "phoneNumber": "+1122334455"
}
```

**Error Response (404):**

```json
{
  "error": "Doctor not found"
}
```

### Create Doctor

```http
POST /api/doctors
Content-Type: application/json
```

**Request Body:**

```json
{
  "id": "102",
  "rcm": "CRM67890",
  "name": "Johnson",
  "specialty": ["Pediatrics", "Family Medicine"],
  "phoneNumber": "+1234567890"
}
```

**Response (201):**

```json
{
  "id": "102",
  "rcm": "CRM67890",
  "name": "Johnson",
  "specialty": ["Pediatrics", "Family Medicine"],
  "phoneNumber": "+1234567890",
  "workingHours": {
    "hours": []
  }
}
```

### Update Doctor

```http
PUT /api/doctors/:id
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Dr. Johnson",
  "phoneNumber": "+1987654321"
}
```

**Response (200):**

```json
{
  "id": "102",
  "rcm": "CRM67890",
  "name": "Dr. Johnson",
  "specialty": ["Pediatrics"],
  "phoneNumber": "+1987654321"
}
```

### Delete Doctor

```http
DELETE /api/doctors/:id
```

**Response (200):**

```json
{
  "id": "102",
  "name": "Dr. Johnson",
  "message": "Doctor deleted successfully"
}
```

---

## 👥 Patient Endpoints

### List All Patients

```http
GET /api/patients
```

**Response:**

```json
[
  {
    "id": "1",
    "identificationDocument": "123.123.123-12",
    "name": "John Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "bloodType": "O+",
    "phoneNumber": "+1234567890",
    "email": "john.doe@example.com"
  }
]
```

### Get Patient by ID

```http
GET /api/patients/:id
```

**Response:**

```json
{
  "id": "1",
  "identificationDocument": "123.123.123-12",
  "name": "John Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "bloodType": "O+",
  "address": {
    "street": "Main Street",
    "number": "123",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701"
  },
  "phoneNumber": "+1234567890",
  "email": "john.doe@example.com",
  "emergencyContact": {
    "name": "Jane Doe",
    "phoneNumber": "+0987654321"
  },
  "allergies": [],
  "appointments": [],
  "examinations": []
}
```

### Create Patient

```http
POST /api/patients
Content-Type: application/json
```

**Request Body:**

```json
{
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
}
```

**Response (201):**

```json
{
  "id": "2",
  "identificationDocument": "456.456.456-45",
  "name": "Jane Smith",
  "dateOfBirth": "1985-05-15",
  "gender": "Female",
  "bloodType": "A+",
  "phoneNumber": "+1555555555",
  "email": "jane.smith@example.com"
}
```

### Update Patient

```http
PUT /api/patients/:id
Content-Type: application/json
```

**Request Body:**

```json
{
  "phoneNumber": "+1999999999",
  "email": "jane.newmail@example.com"
}
```

### Delete Patient

```http
DELETE /api/patients/:id
```

### Search Patients by Name

```http
GET /api/patients/search/name/:name
```

**Example:**

```http
GET /api/patients/search/name/John
```

### Search Patients by Blood Type

```http
GET /api/patients/search/bloodType/:bloodType
```

**Example:**

```http
GET /api/patients/search/bloodType/O+
```

**Response:**

```json
[
  {
    "id": "1",
    "name": "John Doe",
    "bloodType": "O+"
  }
]
```

---

## 📅 Doctor Availability

### Check Doctor Availability

```http
POST /api/doctors/:doctorId/availability
Content-Type: application/json
```

**Request Body:**

```json
{
  "date": "2024-07-01T10:00:00Z"
}
```

**Response (200):**

```json
{
  "available": true
}
```

**Response (if unavailable):**

```json
{
  "available": false
}
```

---

## ⏰ Doctor Working Hours

### Add Working Hours

```http
POST /api/doctors/:doctorId/working-hours
Content-Type: application/json
```

**Request Body:**

```json
{
  "day": "Monday",
  "timeSlot": "09:00 AM - 05:00 PM"
}
```

**Response (201):**

```json
{
  "message": "Working hours added successfully",
  "doctor": {
    "id": "101",
    "workingHours": {
      "hours": [
        {
          "day": "Monday",
          "timeSlot": "09:00 AM - 05:00 PM"
        }
      ]
    }
  }
}
```

### Get Doctor Working Hours

```http
GET /api/doctors/:doctorId/working-hours
```

---

## 🎓 Doctor Specialties

### Add Specialty

```http
POST /api/doctors/:doctorId/specialties
Content-Type: application/json
```

**Request Body:**

```json
{
  "specialty": "Neurology"
}
```

### Remove Specialty

```http
DELETE /api/doctors/:doctorId/specialties/:specialty
```

---

## 🚨 Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid request data"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## 📝 Request/Response Format

### Content-Type

All requests and responses use `application/json`.

### Date Format

Dates should be in ISO 8601 format:

```
2024-07-01T10:00:00Z
```

### Error Handling

All errors return a JSON object with an `error` field containing the error message.

---

## 🔐 Authentication (Future)

Currently, the API does not require authentication. In production, implement:

- JWT tokens
- OAuth 2.0
- API keys
- Role-based access control (RBAC)

---

## 📊 Example Usage

### Complete Patient Registration Flow

```bash
# 1. Create a patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123",
    "identificationDocument": "123.456.789-00",
    "name": "Alice Johnson",
    "dateOfBirth": "1990-03-15",
    "gender": "Female",
    "bloodType": "A+",
    "address": {
      "street": "Elm Street",
      "number": "789",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62703"
    },
    "phoneNumber": "+1234567890",
    "email": "alice@example.com",
    "emergencyContact": {
      "name": "Bob Johnson",
      "phoneNumber": "+0987654321"
    }
  }'

# 2. Get patient details
curl http://localhost:3000/api/patients/123

# 3. Search for patients
curl http://localhost:3000/api/patients/search/name/Alice
```

### Complete Doctor Registration Flow

```bash
# 1. Create a doctor
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "id": "201",
    "rcm": "CRM-12345",
    "name": "Dr. Williams",
    "specialty": ["Cardiology"],
    "phoneNumber": "+1122334455"
  }'

# 2. Add working hours
curl -X POST http://localhost:3000/api/doctors/201/working-hours \
  -H "Content-Type: application/json" \
  -d '{
    "day": "Monday",
    "timeSlot": "09:00 AM - 05:00 PM"
  }'

# 3. Check availability
curl -X POST http://localhost:3000/api/doctors/201/availability \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-07-01T10:00:00Z"
  }'

# 4. Get doctor details
curl http://localhost:3000/api/doctors/201
```

---

## 🧪 Testing with cURL

See [examples above](#-example-usage) for cURL commands.

## 🔧 Testing with Postman

Import the following base URL into Postman:

```
http://localhost:3000
```

Create a collection with the endpoints listed above.

---

## 📚 Related Documentation

- [Architecture](ARCHITECTURE.md)
- [Domain Model](DOMAIN_MODEL.md)
- [Development Guide](DEVELOPMENT.md)
