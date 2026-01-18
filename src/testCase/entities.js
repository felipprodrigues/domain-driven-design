import { Appointment } from '../domain/entities/appointment.js';
import { Doctor } from '../domain/entities/doctor.js';
import { Examinations } from '../domain/entities/examinations.js';
import { Patient } from '../domain/entities/patient.js';
import { Address } from '../domain/value-objects/address.js';
import { EmergencyContact } from '../domain/value-objects/emergencyContact.js';

export const address = new Address(
  'Main Street',
  '123',
  'Mesopotamia',
  'Lost State',
  '11234'
);

export const emergencyContact = new EmergencyContact('Jane Doe', '+0987654321');

export const patient = new Patient(
  '1',
  '123.123.123-12',
  'John Doe',
  '1990-01-01',
  'Male',
  'O+',
  address,
  '+1234567890',
  'john.doe@example.com',
  emergencyContact
);

export const doctor = new Doctor(
  '101',
  'CRM12345',
  'Smith',
  ['Cardiology', 'General Medicine'],
  '+1122334455'
);

export const appointment = new Appointment(
  '201',
  new Date('2024-07-01T10:00:00Z'),
  patient,
  doctor,
  'Regular Checkup',
  'Scheduled',
  ''
);

export const exam = new Examinations(
  '301',
  'Blood Test',
  'All values normal',
  new Date('2024-06-15T09:00:00'),
  'LabCorp',
  doctor,
  patient
);
