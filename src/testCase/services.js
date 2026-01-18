import { DoctorService } from '../domain/services/doctor-service/doctorService.js';
import { ExaminationService } from '../domain/services/examinationService.js';
import { PatientService } from '../domain/services/patientService.js';

import { AppointmentService } from '../application/services/AppointmentService.js';
import { DoctorAvailabilityService } from '../domain/services/doctor-service/doctorAvailabilityService.js';
import { NotificationService } from '../infrastructure/notification/notificationService.js';
import {appointmentRepository,
  doctorRepository,
  examinationRepository,
  patientRepository,} from './repositories.js';

export const doctorService = new DoctorService(doctorRepository);
export const patientService = new PatientService(patientRepository);
export const examinationService = new ExaminationService(examinationRepository);
export const doctorAvailabilityService = new DoctorAvailabilityService(
  appointmentRepository,
  doctorService
);
export const notificationService = new NotificationService();
export const appointmentService = new AppointmentService(
  patientService,
  doctorService,
  appointmentRepository,
  doctorAvailabilityService,
  notificationService
);
