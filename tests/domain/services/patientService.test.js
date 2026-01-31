// Unit tests for PatientService
import { expect } from 'chai';
import sinon from 'sinon';
import { Patient } from '../../../src/domain/entities/patient.js';
import { PatientService } from '../../../src/domain/services/patientService.js';

describe('PatientService', () => {
  let patientService;
  let patientRepository;

  beforeEach(() => {
    patientRepository = {
      add: sinon.stub(),
      findById: sinon.stub(),
      findAll: sinon.stub(),
      delete: sinon.stub(),
    };
    patientService = new PatientService(patientRepository);
  });

  it('should add a patient', () => {
    const patient = new Patient(
      null,
      '123.456.789-00',
      'John Doe',
      '1990-01-01',
      'Male',
      'O+',
      {},
      '+1234567890',
      'john@example.com',
      {}
    );

    patientRepository.add.returns('1');
    patientRepository.findById.returns(patient);

    const result = patientService.addPatient(patient);

    expect(patientRepository.add.calledOnce).to.be.true;
    expect(result).to.equal(patient);
  });
});
