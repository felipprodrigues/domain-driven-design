export class NotificationService {
  sendEmailNotification(email, message) {
    console.log(`Sending email to ${email} with message: ${message}`);
  }

  notifyAppointmentScheduled(appointment) {
    const formattedDate = appointment.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = appointment.date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const patientMessage = `Your appointment with Dr. ${
      appointment.doctor.name
    } is scheduled for ${formattedDate} at ${formattedTime}.`;

    this.sendEmailNotification(appointment.patient.email, patientMessage);
  }
}
