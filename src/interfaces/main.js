import express from 'express';
import { setupRoutes } from './routes/apiRoutes.js';

// Import repositories
import { AppointmentRepository } from '../infrastructure/persistance/appointmentRepository.js';
import { DoctorRepository } from '../infrastructure/persistance/doctorRepository.js';
import { ExaminationRepository } from '../infrastructure/persistance/examinationRepository.js';
import { PatientRepository } from '../infrastructure/persistance/patientRepository.js';

// Import services
import { AppointmentService } from '../application/services/AppointmentService.js';
import { DoctorAvailabilityService } from '../domain/services/doctor-service/doctorAvailabilityService.js';
import { DoctorService } from '../domain/services/doctor-service/doctorService.js';
import { DoctorWorkingHoursService } from '../domain/services/doctor-service/doctorWorkingHoursService.js';
import { ExaminationService } from '../domain/services/examinationService.js';
import { PatientService } from '../domain/services/patientService.js';
import { NotificationService } from '../infrastructure/notification/notificationService.js';

// Initialize repositories
const doctorRepository = new DoctorRepository();
const patientRepository = new PatientRepository();
const appointmentRepository = new AppointmentRepository();
const examinationRepository = new ExaminationRepository();

// Initialize services
const doctorService = new DoctorService(doctorRepository);
const doctorWorkingHoursService = new DoctorWorkingHoursService(
  doctorRepository
);
const patientService = new PatientService(patientRepository);
const examinationService = new ExaminationService(examinationRepository);
const notificationService = new NotificationService();
const doctorAvailabilityService = new DoctorAvailabilityService(
  appointmentRepository,
  doctorService
);
const appointmentService = new AppointmentService(
  patientService,
  doctorService,
  appointmentRepository,
  doctorAvailabilityService,
  notificationService
);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
setupRoutes(
  app,
  doctorService,
  patientService,
  appointmentService,
  examinationService,
  doctorAvailabilityService,
  doctorWorkingHoursService
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
