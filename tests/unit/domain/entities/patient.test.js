import { expect } from 'chai';
import sinon from 'sinon';
import { Patient } from '../../../../src/domain/entities/patient.js';
import { Address } from '../../../../src/domain/value-objects/address.js';
import { EmergencyContact } from '../../../../src/domain/value-objects/emergencyContact.js';

describe('Patient Entity', () => {
  const defaultPatientData = {
    identificationNumber: '123456789',
    firstName: 'John Doe',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'Male',
    bloodType: 'O+',
    address: new Address('123 Main St', 'Cityville', 'State', '12345'),
    phoneNumber: '555-1234',
    email: 'john.doe@example.com',
    emergencyContact: new EmergencyContact('Jane Doe', '555-5678', 'Sister'),
  };

  const createPatient = (overrides = {}) => {
    const data = {
      ...defaultPatientData,
      ...overrides,
    };
    return new Patient(
      data.id || '1',
      data.identificationNumber,
      data.firstName,
      data.dateOfBirth,
      data.gender,
      data.bloodType,
      data.address,
      data.phoneNumber,
      data.email,
      data.emergencyContact
    );
  };

  afterEach(() => {
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should create a Patient instance with correct properties', () => {
      const patient = createPatient();

      expect(patient).to.be.instanceOf(Patient);
      expect(patient.identificationDocument).to.equal('123456789');
      expect(patient.name).to.equal('John Doe');
      expect(patient.dateOfBirth).to.be.instanceOf(Date);
      expect(patient.gender).to.equal('Male');
      expect(patient.bloodType).to.equal('O+');
      expect(patient.address).to.equal(defaultPatientData.address);
      expect(patient.phoneNumber).to.equal('555-1234');
      expect(patient.email).to.equal('john.doe@example.com');
      expect(patient.emergencyContact).to.equal(
        defaultPatientData.emergencyContact
      );
    });

    it('should convert birthDate string to Date object', () => {
      const clock = sinon.useFakeTimers(new Date('2024-01-01'));
      const testDate = new Date('1985-05-15T12:00:00.000Z');
      const patient = createPatient({ dateOfBirth: testDate });

      expect(patient.dateOfBirth.getFullYear()).to.equal(1985);
      expect(patient.dateOfBirth.getMonth()).to.equal(4);
      expect(patient.dateOfBirth.getDate()).to.equal(testDate.getDate());

      clock.restore();
    });

    it('should initialize with a new MedicalRecord instance', () => {
      const patient = createPatient();

      expect(patient.medicalRecord).to.exist;
      expect(patient.medicalRecord).to.be.an('object');
    });
  });

  describe('Getters', () => {
    let patient;

    beforeEach(() => {
      patient = createPatient();
    });

    it('should return correct address via getter', () => {
      expect(patient.address).to.equal(defaultPatientData.address);
    });

    it('should return correct emergencyContact via getter', () => {
      expect(patient.emergencyContact).to.equal(
        defaultPatientData.emergencyContact
      );
    });
  });
});
