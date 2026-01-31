// Unit tests for Appointment entity
import { expect } from 'chai';
import { Appointment } from '../../../src/domain/entities/appointment.js';

describe('Appointment Entity', () => {
  it('should create an Appointment instance with valid data', () => {
    const appointment = new Appointment(
      '1',
      '2024-07-01',
      {
        id: '101',
        name: 'John Doe',
      },
      {
        id: '201',
        name: 'Dr. Smith',
      },
      'Checkup',
      'scheduled',
      'Regular checkup'
    );

    expect(appointment.id).to.equal('1');
    expect(appointment.date).to.equal('2024-07-01');
    expect(appointment.patient.id).to.equal('101');
    expect(appointment.doctor.id).to.equal('201');
    expect(appointment.reason).to.equal('Checkup');
    expect(appointment.status).to.equal('scheduled');
  });
});
