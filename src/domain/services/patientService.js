import { Patient } from '../entities/patient.js';
import { Allergy } from '../entities/record/allergy.js';

export class PatientService {
  constructor(patientRepository) {
    if (!patientRepository) {
      throw new Error('PatientRepository is required');
    }
    this.patientRepository = patientRepository;
  }

  addPatient(patientData) {
    if (!(patientData instanceof Patient)) {
      throw new Error('Invalid patient object');
    }

    const id = this.patientRepository.add(patientData);
    const savedPatient = this.patientRepository.findById(id);

    if (!savedPatient) {
      throw new Error('Failed to save patient');
    }

    return savedPatient;
  }

  findAllPatients() {
    return this.patientRepository.findAll();
  }

  findPatientById(patientId) {
    return this.patientRepository.findById(patientId);
  }

  findPatientByName(name) {
    return this.patientRepository.findByName(name);
  }

  findPatientByBloodType(bloodType) {
    return this.patientRepository.findByBloodType(bloodType);
  }

  updatePatient(patientId, updatedData) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    if (updatedData.name) patient.name = updatedData.name;
    if (updatedData.phoneNumber) patient.phoneNumber = updatedData.phoneNumber;
    if (updatedData.email) patient.email = updatedData.email;
    if (updatedData.emergencyContact)
      patient.emergencyContact = updatedData.emergencyContact;
    if (updatedData.address) patient.address = updatedData.address;

    this.patientRepository.update(patientId, patient);
    return patient;
  }

  deletePatient(patientId) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    this.patientRepository.delete(patient.id);
    return patient;
  }

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

  addPatientDiagnosis(patientId, diagnosis) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.medicalRecord.addDiagnosis(diagnosis);
    this.updatePatient(patientId, patient);
    return patient;
  }

  addPatientMedication(patientId, medication) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    patient.medicalRecord.addMedication(medication);

    this.updatePatient(patientId, patient);
    return patient;
  }

  addPatientTreatment(patientId, treatment) {
    const patient = this.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    patient.medicalRecord.addTreatment(treatment);

    this.updatePatient(patientId, patient);
    return patient;
  }
}
