// Unit tests for Medication value object
import { expect } from 'chai';
import { Medication } from '../../../../src/domain/entities/medication.js';

describe('Medication Value Object', () => {
  it('should create a Medication instance with valid data', () => {
    const medication = new Medication('Aspirin', '100mg Daily');

    expect(medication.name).to.equal('Aspirin');
    expect(medication.dosage).to.equal('100mg Daily');
  });
});
