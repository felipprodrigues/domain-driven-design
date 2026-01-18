export class Appointment {
  constructor(id, date, patient, doctor, reason, status, observations) {
    this.id = id;
    this.date = date;
    this.patient = patient;
    this.doctor = doctor;
    this.reason = reason;
    this.status = status;
    this.observations = observations;
  }
}
