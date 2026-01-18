import express from 'express';

export class DoctorSpecialtyController {
  constructor(specialtyService) {
    this.specialtyService = specialtyService;
    this.router = express.Router({ mergeParams: true });
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.addSpecialty.bind(this));
  }

  async addSpecialty(req, res) {
    try {
      const { doctorId } = req.params;
      const { specialties } = req.body;

      const doctor = await this.specialtyService.addSpecialty(
        doctorId,
        specialties
      );

      res.status(200).json(doctor);
    } catch (error) {
      if (error.message === 'Doctor not found.') {
        return res.status(404).json({ error: error.message });
      } else if (error.message === 'Specialty already exists for this doctor') {
        return res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  }
}
