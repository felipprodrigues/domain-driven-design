import express from 'express';

export class DoctorWorkingHoursController {
  constructor(workingHoursService) {
    this.workingHoursService = workingHoursService;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/:id/working-hours', this.addWorkingHours.bind(this));
    this.router.delete(
      '/:id/working-hours',
      this.removeWorkingHours.bind(this)
    );
    this.router.get('/:id/working-hours', this.listWorkingHours.bind(this));
  }

  async addWorkingHours(req, res) {
    try {
      const { id } = req.params;
      const { day, timeSlot } = req.body;
      const updatedDoctor = this.workingHoursService.addDoctorWorkingHours(
        id,
        day,
        timeSlot
      );
      res.status(200).json(updatedDoctor);
    } catch (error) {
      if (error.message === 'Doctor not found.') {
        return res.status(404).json({ error: error.message });
      } else if (
        error.message === 'Working hours already exists for this doctor'
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async removeWorkingHours(req, res) {
    try {
      const { id } = req.params;
      const { day, timeSlot } = req.body;
      const updatedDoctor = this.workingHoursService.removeWorkingHours(
        id,
        day,
        timeSlot
      );
      res.status(200).json(updatedDoctor);
    } catch (error) {
      if (error.message === 'Doctor not found.') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }

  async listWorkingHours(req, res) {
    try {
      const { id } = req.params;
      const workingHours = this.workingHoursService.listWorkingHours(id);
      res.status(200).json(workingHours);
    } catch (error) {
      if (error.message === 'Doctor not found.') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }
}
