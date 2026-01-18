import { Repository } from '../../domain/repositories/repository.js';

export class DoctorRepository extends Repository {
  constructor() {
    super();
  }

  findByName(name) {
    return this.findAll().filter((doctor) => doctor.name === name);
  }

  findBySpecialization(spec) {
    return this.findAll().filter((doctor) => doctor.specialty.includes(spec));
  }
}
