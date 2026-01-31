// Unit tests for EmergencyContact value object
import { expect } from 'chai';
import { EmergencyContact } from '../../../src/domain/value-objects/emergencyContact.js';

describe('EmergencyContact Value Object', () => {
  it('should create an EmergencyContact instance with valid data', () => {
    const contact = new EmergencyContact('Jane Doe', '+9876543210');

    expect(contact.name).to.equal('Jane Doe');
    expect(contact.phone).to.equal('+9876543210');
  });

  it('should check equality between emergency contacts', () => {
    const contact1 = new EmergencyContact('Jane Doe', '+9876543210');
    const contact2 = new EmergencyContact('Jane Doe', '+9876543210');
    const contact3 = new EmergencyContact('John Smith', '+1234567890');

    expect(contact1.equals(contact2)).to.be.true;
    expect(contact1.equals(contact3)).to.be.false;
  });
});
