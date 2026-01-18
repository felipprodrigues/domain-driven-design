import { AppointmentController } from '../controllers/appointmentController.js';
import { DoctorAvailabilityController } from '../controllers/doctor-controllers/doctorAvailabilityController.js';
import { DoctorController } from '../controllers/doctor-controllers/doctorController.js';
import { DoctorSpecialtyController } from '../controllers/doctor-controllers/doctorSpecialtyController.js';
import { DoctorWorkingHoursController } from '../controllers/doctor-controllers/doctorWorkingHoursController.js';
import { ExamController } from '../controllers/examsController.js';
import { PatientController } from '../controllers/patientController.js';

export function setupRoutes(
  app,
  doctorService,
  patientService,
  appointmentService,
  examinationService,
  doctorAvailabilityService,
  doctorWorkingHoursService
) {
  // Doctor routes
  const doctorController = new DoctorController(doctorService);
  app.use('/api/doctors', doctorController.router);

  // Doctor working hours routes
  const doctorWorkingHoursController = new DoctorWorkingHoursController(
    doctorWorkingHoursService
  );
  app.use('/api/doctors', doctorWorkingHoursController.router);

  // Doctor specialty routes
  const doctorSpecialtyController = new DoctorSpecialtyController(
    doctorService
  );
  app.use('/api/doctors', doctorSpecialtyController.router);

  // Doctor availability routes
  const doctorAvailabilityController = new DoctorAvailabilityController(
    doctorAvailabilityService
  );
  app.use('/api/doctors', doctorAvailabilityController.router);

  // Patient routes
  const patientController = new PatientController(patientService);
  app.use('/api/patients', patientController.router);

  // Appointment routes
  const appointmentController = new AppointmentController(appointmentService);
  app.use('/api/appointments', appointmentController.router);

  // Examination routes
  const examController = new ExamController(examinationService);
  app.use('/api/examinations', examController.router);

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'API is running',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });
}
