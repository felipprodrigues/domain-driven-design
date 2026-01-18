import { appointment, doctor, patient } from './entities.js';
import {
  appointmentService,
  doctorService,
  patientService,
} from './services.js';

const addedDoctor = doctorService.addDoctor(doctor);

// Add working hours to the doctor stored in repository
addedDoctor.workingHours.hours.push({
  day: 'Monday',
  timeSlot: '06:00 AM - 10:00 PM',
});

patientService.addPatient(patient);

appointmentService.execute(appointment);

console.log('✓ Appointment scheduled successfully!');
