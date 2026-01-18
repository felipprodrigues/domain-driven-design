/* eslint-disable max-len */
export class DoctorAvailabilityService {
  constructor(appointmentRepository, doctorService) {
    this.appointmentRepository = appointmentRepository;
    this.doctorService = doctorService;
  }

  isDoctorAvailable(doctorId, date) {
    const doctor = this.doctorService.findDoctorById(doctorId);

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    if (!(date instanceof Date)) {
      throw new Error('Invalid date');
    }

    const hasAppointmentConflict = this.hasAppointmentConflict(doctorId, date);
    if (hasAppointmentConflict) {
      console.log(
        `Doctor has a conflicting appointment on ${date.toISOString()}`
      );
      return false;
    }

    const isWithinWorkingHours = this.isWithinWorkingHours(doctor, date);
    if (!isWithinWorkingHours) {
      console.log(
        `Requested time ${date.toISOString()} is outside of doctor's working hours`
      );
      return false;
    }

    return true;
  }

  hasAppointmentConflict(doctorId, date) {
    const doctorAppointments =
      this.appointmentRepository.findByDoctorId(doctorId);
    return doctorAppointments.some(
      (appointment) => appointment.date.getTime() === date.getTime()
    );
  }

  checkDate(date) {
    const parsedDate = new Date(date);
    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    }

    const offset = parsedDate.getTimezoneOffset() * 60000;
    return new Date(parsedDate.getTime() - offset);
  }

  isWithinWorkingHours(doctor, date) {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const timeSlot = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return doctor.workingHours.hours.some(
      (workingHour) =>
        workingHour.day === dayOfWeek &&
        this.isTimeWithinSlot(timeSlot, workingHour.timeSlot)
    );
  }

  isTimeWithinSlot(time, timeSlot) {
    const [startTime, endTime] = timeSlot.split(' - ');

    const timeToMinutes = (timeStr) => {
      const isPM = timeStr.includes('PM');
      const isAM = timeStr.includes('AM');
      const cleanTime = timeStr.replace(/AM|PM/g, '').trim();
      const [hours, minutes] = cleanTime.split(':').map(Number);

      let adjustedHours = hours;
      if (isPM && hours !== 12) {
        adjustedHours = hours + 12;
      } else if (isAM && hours === 12) {
        adjustedHours = 0;
      }

      return adjustedHours * 60 + (minutes || 0);
    };

    const timeInMinutes = timeToMinutes(time);
    const startInMinutes = timeToMinutes(startTime);
    const endInMinutes = timeToMinutes(endTime);

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  }
}
