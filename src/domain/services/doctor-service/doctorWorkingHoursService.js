import { WorkingHours } from '../../value-objects/workingHours.js';

export class DoctorWorkingHoursService {
  constructor(doctorRepository) {
    this.doctorRepository = doctorRepository;
  }

  addDoctorWorkingHours(doctorId, day, timeSlot) {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const hasWorkingHours = doctor.workingHours.hours.some(
      (workingHour) =>
        workingHour.day === day && workingHour.timeSlot === timeSlot
    );

    if (hasWorkingHours) {
      throw new Error('Working hours already exists for this doctor');
    }

    doctor.workingHours.hours.push({
      day,
      timeSlot,
    });
    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  removeWorkingHours(doctorId, day, timeSlot) {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    doctor.workingHours.hours = doctor.workingHours.hours.filter(
      (hour) => hour.day !== day && hour.timeSlot !== timeSlot
    );

    this.doctorRepository.update(doctor.id, doctor);
    return doctor;
  }

  listWorkingHours(doctorId) {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    return doctor.workingHours.hours();
  }

  getWorkingHours(doctorId) {
    const doctor = this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    if (!doctor.workingHours) {
      doctor.workingHours = new WorkingHours();
    }

    return doctor.workingHours;
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

    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(/:| /).map(Number);
      const period = time.includes('PM') && hours !== 12 ? 12 : 0;
      return (hours + period) * 60 + minutes;
    };

    const timeInMinutes = timeToMinutes(time);
    const startInMinutes = timeToMinutes(startTime);
    const endInMinutes = timeToMinutes(endTime);

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  }
}
