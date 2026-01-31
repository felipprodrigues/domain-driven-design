// Unit tests for MedicalRecord value object
import { expect } from 'chai';
import { Medication } from '../../../../src/domain/entities/medication.js';
import { Diagnosis } from '../../../../src/domain/entities/record/diagnosis.js';
import { MedicalRecord } from '../../../../src/domain/entities/record/medicalRecord.js';
import { Treatment } from '../../../../src/domain/entities/record/treatment.js';

describe('MedicalRecord Value Object', () => {
  let record;

  beforeEach(() => {
    record = new MedicalRecord();
  });

  it('should create a MedicalRecord instance with empty arrays', () => {
    expect(record.diagnosis).to.be.an('array').that.is.empty;
    expect(record.medications).to.be.an('array').that.is.empty;
    expect(record.treatments).to.be.an('array').that.is.empty;
  });

  it('should add a valid diagnosis', () => {
    const diagnosis = new Diagnosis('Diabetes');
    record.addDiagnosis(diagnosis);
    expect(record.diagnosis).to.include(diagnosis);
  });

  it('should add a valid medication', () => {
    const medication = new Medication('Aspirin', '100mg Daily');
    record.addMedication(medication);
    expect(record.medications).to.include(medication);
  });

  it('should add a valid treatment', () => {
    const treatment = new Treatment('Physical Therapy');
    record.addTreatment(treatment);
    expect(record.treatments).to.include(treatment);
  });
});
