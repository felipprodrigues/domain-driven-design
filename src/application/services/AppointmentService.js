export class AppointmentService {
  constructor(
    patientService,
    doctorService,
    appointmentRepository,
    doctorAvailabilityService,
    notificationService
  ) {
    this.patientService = patientService;
    this.doctorService = doctorService;
    this.appointmentRepository = appointmentRepository;
    this.doctorAvailabilityService = doctorAvailabilityService;
    this.notificationService = notificationService;
  }

  execute(appointmentData) {
    const date =
      typeof appointmentData.date === 'string'
        ? new Date(appointmentData.date)
        : appointmentData.date;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid appointment date');
    }

    // Handle both formats: {patientId, doctorId} or {patient: {id}, doctor: {id}}
    const patientId = appointmentData.patientId || appointmentData.patient?.id;
    const doctorId = appointmentData.doctorId || appointmentData.doctor?.id;

    if (!patientId || !doctorId) {
      throw new Error('Patient ID and Doctor ID are required');
    }

    const patient = this.patientService.findPatientById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const doctor = this.doctorService.findDoctorById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const isDoctorAvailable = this.doctorAvailabilityService.isDoctorAvailable(
      doctorId,
      date
    );
    if (!isDoctorAvailable) {
      throw new Error('Doctor is not available at the requested time');
    }

    // Create appointment with the provided data
    const appointment = {
      id: appointmentData.id,
      date: date,
      patient: patient,
      doctor: doctor,
      reason: appointmentData.reason,
      status: appointmentData.status || 'scheduled',
      observations: appointmentData.observations || '',
    };

    this.appointmentRepository.add(appointment.id, appointment);
    this.notificationService.notifyAppointmentScheduled(appointment);

    return appointment;
  }

  findById(id) {
    const appointment = this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return appointment;
  }

  findAll() {
    return this.appointmentRepository.findAll();
  }

  checkDate(appointment) {
    const date =
      typeof appointment.date === 'string'
        ? new Date(appointment.date)
        : appointment.date;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid appointment date');
    }

    return date;
  }
}
