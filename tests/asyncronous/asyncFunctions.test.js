import { expect } from 'chai';
import { fetchData, fetchDataPromise } from './asyncFunctions.js';

describe('Asynchronous Functions', () => {
  it('should return "Data fetched"', (done) => {
    fetchData((data) => {
      expect(data).to.equal('Data fetched');
      done();
    });
  });

  it('should return "Data fetched" using Promise', async () => {
    const result = await fetchDataPromise();
    expect(result).to.equal('Data fetched');
  });
});
