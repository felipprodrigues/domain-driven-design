import { expect } from 'chai';
import sinon from 'sinon';
import { Patient } from '../../../src/domain/entities/patient.js';
import { PatientService } from '../../../src/domain/services/patientService.js';
import { PatientController } from '../../../src/interfaces/controllers/patientController.js';

describe('PatientController', () => {
  let patientController;
  let patientService;
  let sandbox;

  const mockPatientData = {
    identificationDocument: '123456789',
    name: 'John Doe',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    bloodType: 'A+',
    address: {},
    phoneNumber: '555-1234',
    email: 'john.doe@example.com',
    emergencyContact: {},
  };

  const createPatient = (id = null) => {
    return new Patient(
      id,
      mockPatientData.identificationDocument,
      mockPatientData.name,
      mockPatientData.dateOfBirth,
      mockPatientData.gender,
      mockPatientData.bloodType,
      mockPatientData.address,
      mockPatientData.phoneNumber,
      mockPatientData.email,
      mockPatientData.emergencyContact
    );
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    patientService = sandbox.createStubInstance(PatientService);

    patientController = new PatientController(patientService);
  });

  describe('createPatient', () => {
    it('should add a new patient via service', async () => {
      const req = { body: mockPatientData };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      patientService.addPatient.resolves(mockPatientData);

      await patientController.createPatient(req, res);

      expect(patientService.addPatient.calledWith(mockPatientData)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(mockPatientData)).to.be.true;
    });
  });

  describe('getPatientById', () => {
    it('should return a patient when found', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      const mockPatient = createPatient('1');

      patientService.findPatientById.resolves(mockPatient);

      await patientController.getPatientById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockPatient)).to.be.true;
    });

    it('should return 404 when patient not found', async () => {
      const req = { params: { id: '2' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      const error = new Error('Patient not found');
      patientService.findPatientById.rejects(error);

      await patientController.getPatientById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Patient not found' })).to.be.true;
    });
  });

  describe('deletePatient', () => {
    it('should delete a patient when found', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      const mockPatient = createPatient('1');

      patientService.deletePatient.resolves(mockPatient);

      await patientController.deletePatient(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockPatient)).to.be.true;
    });

    it('should return 404 when trying to delete a non-existent patient', async () => {
      const req = { params: { id: '2' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      const error = new Error('Patient not found');
      patientService.deletePatient.rejects(error);

      await patientController.deletePatient(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Patient not found' })).to.be.true;
    });
  });

  describe('Update patient', () => {
    it('should update a patient when found', async () => {
      const req = {
        params: { id: '1' },
        body: { name: 'Jane Doe' },
      };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub(),
      };

      const updatedPatient = createPatient('1');
      updatedPatient.name = 'Jane Doe';

      patientService.updatePatient.resolves(updatedPatient);

      await patientController.updatePatient(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedPatient)).to.be.true;
    });
  });
});
