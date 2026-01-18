import express from 'express';

export class ExamController {
  constructor(examService) {
    this.examService = examService;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.scheduleExam.bind(this));
    this.router.get('/:id', this.getExamById.bind(this));
    this.router.get('/', this.getAllExams.bind(this));
    this.router.put('/:id', this.updateExam.bind(this));
    this.router.delete('/:id', this.deleteExam.bind(this));

    this.router.get('/patient/:patientId', this.getExamByPatientId.bind(this));
    this.router.get('/type/:type', this.getExamByType.bind(this));
    this.router.get('/date/:date', this.getExamByDate.bind(this));
  }

  async scheduleExam(req, res) {
    try {
      const examData = req.body;
      const exam = this.examService.scheduleExamination(examData);
      res.status(201).json(exam);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getExamById(req, res) {
    try {
      const { id } = req.params;
      const exam = this.examService.findExamById(id);
      res.status(200).json(exam);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getAllExams(req, res) {
    try {
      const exams = this.examService.examinationRepository.findAll();
      res.status(200).json(exams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateExam(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedExam = this.examService.updateExam(id, updatedData);
      res.status(200).json(updatedExam);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteExam(req, res) {
    try {
      const { id } = req.params;
      const deletedExam = this.examService.deleteExam(id);
      res.status(200).json(deletedExam);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getExamByPatientId(req, res) {
    try {
      const { patientId } = req.params;
      const exams = this.examService.findExamByPatientId(patientId);
      res.status(200).json(exams);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getExamByType(req, res) {
    try {
      const { type } = req.params;
      const exams = this.examService.findExamByType(type);
      res.status(200).json(exams);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getExamByDate(req, res) {
    try {
      const { date } = req.params;
      const exams = this.examService.findExamByDate(date);
      res.status(200).json(exams);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
