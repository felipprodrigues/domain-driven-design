// Unit tests for Treatment value object
import { expect } from 'chai';
import { Treatment } from '../../../../src/domain/entities/record/treatment.js';

describe('Treatment Value Object', () => {
  it('should create a Treatment instance with valid data', () => {
    const treatment = new Treatment('Physical Therapy');

    expect(treatment.description).to.equal('Physical Therapy');
  });
});
