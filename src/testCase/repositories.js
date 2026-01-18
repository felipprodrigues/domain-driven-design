import { AppointmentRepository } from '../infrastructure/persistance/appointmentRepository.js';
import { DoctorRepository } from '../infrastructure/persistance/doctorRepository.js';
import { ExaminationRepository } from '../infrastructure/persistance/examinationRepository.js';
import { PatientRepository } from '../infrastructure/persistance/patientRepository.js';

export const patientRepository = new PatientRepository();
export const doctorRepository = new DoctorRepository();
export const appointmentRepository = new AppointmentRepository();
export const examinationRepository = new ExaminationRepository();
