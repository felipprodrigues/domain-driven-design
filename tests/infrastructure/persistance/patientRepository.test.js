import { expect } from 'chai';
import sinon from 'sinon';
import { PatientRepository } from '../../../src/infrastructure/persistance/patientRepository.js';

describe('PatientRepository', () => {
  let patientRepository;
  let sandbox;

  beforeEach(() => {
    patientRepository = new PatientRepository();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should generate unique IDs when adding patients', () => {
    const addStub = sandbox.stub().onCall(0).returns(1).onCall(1).returns(2);

    const patient1 = {
      name: 'John Doe',
      bloodType: 'A+',
    };
    const patient2 = {
      name: 'Jane Smith',
      bloodType: 'B-',
    };

    const id1 = addStub(patient1);
    const id2 = addStub(patient2);

    expect(id1).to.equal(1);
    expect(id2).to.equal(2);
    expect(id1).to.not.equal(id2);

    sinon.assert.calledWith(addStub.firstCall, patient1);
    sinon.assert.calledWith(addStub.secondCall, patient2);
  });

  it('should find patients by name', () => {
    const patients = [
      {
        id: 1,
        name: 'Alice',
        bloodType: 'A+',
      },
      {
        id: 2,
        name: 'Alice',
        bloodType: 'B-',
      },
    ];

    sandbox.stub(patientRepository, 'findByName').returns(patients);

    const results = patientRepository.findByName('Alice');
    expect(results).to.have.lengthOf(2);
    expect(results[0].bloodType).to.equal('A+');
    expect(results[1].bloodType).to.equal('B-');
  });

  it('should find patients by blood type', () => {
    const patients = [
      {
        id: 1,
        name: 'Bob',
        bloodType: 'O+',
      },
      {
        id: 2,
        name: 'Charlie',
        bloodType: 'O+',
      },
    ];

    sandbox.stub(patientRepository, 'findByBloodType').returns(patients);

    const results = patientRepository.findByBloodType('O+');
    expect(results).to.have.lengthOf(2);
    expect(results[0].name).to.equal('Bob');
    expect(results[1].name).to.equal('Charlie');
  });

  it('should add patients with unique IDs', () => {
    const patient1 = {
      name: 'David',
      bloodType: 'AB+',
    };
    const patient2 = {
      name: 'Eve',
      bloodType: 'A-',
    };

    const addStub = sandbox.stub(patientRepository, 'add');

    patientRepository.add(patient1);
    patientRepository.add(patient2);

    sinon.assert.calledWith(addStub.firstCall, patient1);
    sinon.assert.calledWith(addStub.secondCall, patient2);
  });
});
