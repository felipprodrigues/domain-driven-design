import { Appointment } from './appointment.js';
import { Examinations } from './examinations.js';
import { MedicalRecord } from './record/medicalRecord.js';

export class Patient {
  constructor(
    id,
    identificationDocument,
    name,
    dateOfBirth,
    gender,
    bloodType,
    address,
    phoneNumber,
    email,
    emergencyContact
  ) {
    this.id = id;
    this.gender = gender;
    this.bloodType = bloodType;
    this.name = name;
    this.dateOfBirth = dateOfBirth;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.email = email;

    this.identificationDocument = identificationDocument;
    this.emergencyContact = emergencyContact;

    this.allergies = [];
    this.appointments = [];
    this.examinations = [];
    this.medicalRecord = new MedicalRecord();
  }

  addExamination(exam) {
    if (!(exam instanceof Examinations)) {
      throw new Error('Invalid examination');
    }

    (this.examinations.push({ exam }),
      console.log(
        `Examination ${exam.name} added with result: ${exam.result}`
      ));
  }

  scheduleAppointment(appointment) {
    if (!(appointment instanceof Appointment)) {
      throw new Error('Invalid appointment');
    }

    const hasConflict = this.appointments.some((existingAppointment) =>
      appointment.hasConflict(existingAppointment)
    );

    if (!hasConflict) {
      this.appointments.push(appointment);
      console.log(
        `Appointment on ${appointment.date} scheduled for patient ${this.name} with Dr. ${appointment.doctor.name}`
      );
    } else {
      console.log(
        `Appointment conflict detected for patient ${this.name} on ${appointment.date}`
      );
    }
  }
}
