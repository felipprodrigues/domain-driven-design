import { Repository } from '../../domain/repositories/repository.js';

export class ExaminationRepository extends Repository {
  constructor() {
    super();
  }

  findByPatientId(patientId) {
    return this.findAll().filter(
      (examination) => (examination.patient.id = patientId)
    );
  }

  findByType(type) {
    return this.findAll().filter((examination) => (examination.type = type));
  }

  findByDate(date) {
    return this.findAll().filter((examination) => examination.date === date);
  }
}
