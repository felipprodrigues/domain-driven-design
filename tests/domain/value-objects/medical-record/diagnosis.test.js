// Unit tests for Diagnosis value object
import { expect } from 'chai';
import { Diagnosis } from '../../../../src/domain/entities/record/diagnosis.js';

describe('Diagnosis Value Object', () => {
  it('should create a Diagnosis instance with valid data', () => {
    const diagnosis = new Diagnosis('Hypertension');

    expect(diagnosis.description).to.equal('Hypertension');
  });
});
