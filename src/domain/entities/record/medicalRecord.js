import { Medication } from '../medication.js';
import { Diagnosis } from './diagnosis.js';
import { Treatment } from './treatment.js';

export class MedicalRecord {
  constructor() {
    this.diagnosis = [];
    this.treatments = [];
    this.medications = [];
  }

  addDiagnosis(diagnosis) {
    if (!(diagnosis instanceof Diagnosis)) throw new Error('Invalid diagnosis');

    this.diagnosis.push(diagnosis);
    console.log(`Diagnosis ${diagnosis} added to medical record`);
  }

  addTreatment(treatment) {
    if (!(treatment instanceof Treatment)) throw new Error('Invalid treatment');

    this.treatments.push(treatment);
    console.log(`Treatment ${treatment} added to medical record`);
  }

  addMedication(medication) {
    if (!(medication instanceof Medication))
      throw new Error('Invalid medication');

    this.medications.push(medication);
    console.log(`Medication ${medication} added to medical record`);
  }

  equals(otherRecord) {
    return (
      this.diagnosis.length === otherRecord.diagnosis.length &&
      this.treatments.length === otherRecord.treatments.length &&
      this.medications.length === otherRecord.medications.length &&
      this.diagnosis.every((item, index) =>
        item.equals(otherRecord.diagnosis[index])) &&
      this.treatments.every((item, index) =>
        item.equals(otherRecord.treatments[index])) &&
      this.medications.every((item, index) =>
        item.equals(otherRecord.medications[index]))
    );
  }
}
