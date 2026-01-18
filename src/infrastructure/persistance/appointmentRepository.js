import { Repository } from '../../domain/repositories/repository.js';

export class AppointmentRepository extends Repository {
  constructor() {
    super();
  }

  findByPatientId(patientId) {
    return this.findAll().filter(
      (appointment) => (appointment.patient.id = patientId)
    );
  }

  findByDoctorId(doctorId) {
    return this.findAll().filter(
      (appointment) => (appointment.doctor.id = doctorId)
    );
  }

  findByStatus(status) {
    return this.findAll().filter(
      (appointment) => appointment.status === status
    );
  }
}
