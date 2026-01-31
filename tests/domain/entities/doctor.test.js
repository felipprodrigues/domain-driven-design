// Unit tests for Doctor entity
import { expect } from 'chai';
import { Doctor } from '../../../src/domain/entities/doctor.js';

describe('Doctor Entity', () => {
  it('should create a Doctor instance with valid data', () => {
    const doctor = new Doctor(
      '1',
      'CRM12345',
      'Dr. Smith',
      ['Cardiology'],
      '+1234567890'
    );

    expect(doctor.id).to.equal('1');
    expect(doctor.rcm).to.equal('CRM12345');
    expect(doctor.name).to.equal('Dr. Smith');
    expect(doctor.specialty).to.deep.equal(['Cardiology']);
    expect(doctor.phoneNumber).to.equal('+1234567890');
  });
});
