// Integration test for complete patient appointment workflow
import { expect } from 'chai';
import { Appointment } from '../../../src/domain/entities/appointment.js';
import { Doctor } from '../../../src/domain/entities/doctor.js';
import { Medication } from '../../../src/domain/entities/medication.js';
import { Patient } from '../../../src/domain/entities/patient.js';
import { Diagnosis } from '../../../src/domain/entities/record/diagnosis.js';
import { PatientService } from '../../../src/domain/services/patientService.js';
import { Address } from '../../../src/domain/value-objects/address.js';
import { EmergencyContact } from '../../../src/domain/value-objects/emergencyContact.js';
import { WorkingHours } from '../../../src/domain/value-objects/workingHours.js';
import { AppointmentRepository } from '../../../src/infrastructure/persistance/appointmentRepository.js';
import { DoctorRepository } from '../../../src/infrastructure/persistance/doctorRepository.js';
import { PatientRepository } from '../../../src/infrastructure/persistance/patientRepository.js';

describe('Patient Appointment Workflow - Full Integration Test', () => {
  let patientRepo;
  let doctorRepo;
  let appointmentRepo;
  let patientService;

  beforeEach(() => {
    // Initialize repositories
    patientRepo = new PatientRepository();
    doctorRepo = new DoctorRepository();
    appointmentRepo = new AppointmentRepository();

    // Initialize services
    patientService = new PatientService(patientRepo);
  });

  it('should complete full workflow: register patient, doctor, create appointment, and update medical record', () => {
    // Step 1: Register a new patient
    const patientAddress = new Address(
      '123 Main St',
      'New York',
      'NY',
      '10001',
      'USA'
    );

    const emergencyContact = new EmergencyContact(
      'Jane Doe',
      '555-0123',
      'Sister'
    );

    const patient = new Patient(
      null,
      '123.456.789-00',
      'John Doe',
      '1990-05-15',
      'Male',
      'O+',
      patientAddress,
      '555-1234',
      'john.doe@email.com',
      emergencyContact
    );

    const savedPatient = patientService.addPatient(patient);
    expect(savedPatient).to.not.be.null;
    expect(savedPatient.id).to.not.be.null;
    expect(savedPatient.name).to.equal('John Doe');

    // Step 2: Register a doctor
    const doctorAddress = new Address(
      '456 Medical Plaza',
      'New York',
      'NY',
      '10002',
      'USA'
    );

    const workingHours = new WorkingHours('09:00', '17:00');

    const doctorId = `doctor-${Date.now()}`;
    const doctor = new Doctor(
      doctorId,
      '987.654.321-00',
      'Dr. Sarah Smith',
      ['Cardiology'],
      '555-5678',
      workingHours
    );

    doctorRepo.add(doctorId, doctor);
    const savedDoctor = doctorRepo.findById(doctorId);

    expect(savedDoctor).to.not.be.null;
    expect(savedDoctor.name).to.equal('Dr. Sarah Smith');
    expect(savedDoctor.specialty).to.deep.equal(['Cardiology']);

    // Step 3: Schedule an appointment
    const appointmentDate = '2026-02-15';
    const appointmentId = `appointment-${Date.now()}`;
    const appointment = new Appointment(
      appointmentId,
      appointmentDate,
      savedPatient,
      savedDoctor,
      'Annual checkup and heart health evaluation',
      'scheduled',
      'Patient reports occasional chest discomfort'
    );

    appointmentRepo.add(appointmentId, appointment);
    const savedAppointment = appointmentRepo.findById(appointmentId);

    expect(savedAppointment).to.not.be.null;
    expect(savedAppointment.status).to.equal('scheduled');
    expect(savedAppointment.patient.id).to.equal(savedPatient.id);
    expect(savedAppointment.doctor.id).to.equal(doctorId);

    // Step 4: Complete appointment and update medical record with diagnosis
    const diagnosis = new Diagnosis(
      'Mild Hypertension - Stage 1 hypertension, blood pressure 145/92'
    );

    savedPatient.medicalRecord.addDiagnosis(diagnosis);

    // Add prescribed medication
    const medication = new Medication('Lisinopril', '10mg once daily');

    savedPatient.medicalRecord.addMedication(medication);

    // Update patient in repository
    patientService.updatePatient(savedPatient.id, savedPatient);
    const updatedPatient = patientRepo.findById(savedPatient.id);

    // Step 5: Verify the complete workflow
    expect(updatedPatient).to.not.be.null;
    expect(updatedPatient.medicalRecord.diagnosis).to.have.lengthOf(1);
    expect(updatedPatient.medicalRecord.diagnosis[0].description).to.include(
      'Mild Hypertension'
    );
    expect(updatedPatient.medicalRecord.medications).to.have.lengthOf(1);
    expect(updatedPatient.medicalRecord.medications[0]).to.not.be.undefined;
    expect(updatedPatient.medicalRecord.medications[0].name).to.equal(
      'Lisinopril'
    );

    // Verify appointment is still accessible
    const retrievedAppointment = appointmentRepo.findById(appointmentId);
    expect(retrievedAppointment).to.not.be.null;
    expect(retrievedAppointment.patient.name).to.equal('John Doe');
    expect(retrievedAppointment.doctor.name).to.equal('Dr. Sarah Smith');

    // Step 6: Update appointment status to completed
    savedAppointment.status = 'completed';
    appointmentRepo.update(appointmentId, savedAppointment);
    const completedAppointment = appointmentRepo.findById(appointmentId);
    expect(completedAppointment.status).to.equal('completed');

    // Final verification: retrieve all entities to ensure persistence
    const allPatients = patientRepo.findAll();
    const allDoctors = doctorRepo.findAll();
    const allAppointments = appointmentRepo.findAll();

    expect(allPatients).to.have.lengthOf(1);
    expect(allDoctors).to.have.lengthOf(1);
    expect(allAppointments).to.have.lengthOf(1);
  });
});
