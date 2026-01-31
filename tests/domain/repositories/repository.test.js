// Unit tests for Repository interface
import { expect } from 'chai';
import { Repository } from '../../../src/domain/repositories/repository.js';

describe('Repository', () => {
  it('should add and retrieve entities', () => {
    const repo = new Repository();
    const entity = { name: 'Test Entity' };

    repo.add('1', entity);
    const retrieved = repo.findById('1');

    expect(retrieved).to.equal(entity);
  });

  it('should throw error when adding duplicate id', () => {
    const repo = new Repository();
    const entity = { name: 'Test' };

    repo.add('1', entity);
    expect(() => repo.add('1', entity)).to.throw(
      'Entity with id 1 already exists'
    );
  });

  it('should return all entities', () => {
    const repo = new Repository();
    repo.add('1', { name: 'Entity 1' });
    repo.add('2', { name: 'Entity 2' });

    const all = repo.findAll();
    expect(all).to.have.lengthOf(2);
  });
});
