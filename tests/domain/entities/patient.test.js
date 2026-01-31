// Unit tests for Patient entity
import { expect } from 'chai';
import { Patient } from '../../../src/domain/entities/patient.js';

describe('Patient Entity', () => {
  it('should create a Patient instance with valid data', () => {
    const patient = new Patient(
      '1',
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

    expect(patient.id).to.equal('1');
    expect(patient.name).to.equal('John Doe');
    expect(patient.identificationDocument).to.equal('123.456.789-00');
  });
});
