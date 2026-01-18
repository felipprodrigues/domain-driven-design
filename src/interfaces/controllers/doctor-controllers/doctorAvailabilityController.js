import express from 'express';

export class DoctorAvailabilityController {
  constructor(doctorAvailabilityService) {
    this.doctorAvailabilityService = doctorAvailabilityService;
    this.router = express.Router({ mergeParams: true });
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.checkAvailability.bind(this));
  }

  async checkAvailability(req, res) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format.');
      }

      const availability =
        await this.doctorAvailabilityService.isDoctorAvailable(doctorId, date);

      res.status(200).json({ available: availability });
    } catch (error) {
      if (error.message === 'Doctor not found.') {
        return res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  }
}
