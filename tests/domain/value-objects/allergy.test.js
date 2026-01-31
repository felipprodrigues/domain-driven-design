// Unit tests for Allergy value object
import { expect } from 'chai';
import { Allergy } from '../../../src/domain/entities/record/allergy.js';

describe('Allergy Value Object', () => {
  it('should create an Allergy instance with valid data', () => {
    const allergy = new Allergy('Peanuts');

    expect(allergy.type).to.equal('Peanuts');
  });

  it('should check equality between allergies', () => {
    const allergy1 = new Allergy('Peanuts');
    const allergy2 = new Allergy('Peanuts');
    const allergy3 = new Allergy('Shellfish');

    expect(allergy1.equals(allergy2)).to.be.true;
    expect(allergy1.equals(allergy3)).to.be.false;
  });
});
