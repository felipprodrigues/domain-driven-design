// Unit tests for Address value object
import { expect } from 'chai';
import { Address } from '../../../src/domain/value-objects/address.js';

describe('Address Value Object', () => {
  it('should create an Address instance with valid data', () => {
    const address = new Address('123 Main St', '100', 'Anytown', 'CA', '12345');

    expect(address.street).to.equal('123 Main St');
    expect(address.number).to.equal('100');
    expect(address.city).to.equal('Anytown');
    expect(address.state).to.equal('CA');
    expect(address.zipCode).to.equal('12345');
  });

  it('should check equality between addresses', () => {
    const address1 = new Address(
      '123 Main St',
      '100',
      'Anytown',
      'CA',
      '12345'
    );
    const address2 = new Address(
      '123 Main St',
      '100',
      'Anytown',
      'CA',
      '12345'
    );
    const address3 = new Address(
      '456 Oak Ave',
      '200',
      'Othertown',
      'NY',
      '54321'
    );

    expect(address1.equals(address2)).to.be.true;
    expect(address1.equals(address3)).to.be.false;
  });
});
