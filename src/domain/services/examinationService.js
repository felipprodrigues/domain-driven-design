import { Examinations } from '../entities/examinations.js';

export class ExaminationService {
  constructor(examinationRepository) {
    this.examinationRepository = examinationRepository;
  }

  scheduleExamination(examination) {
    const exam = new Examinations(
      examination.id,
      examination.type,
      examination.result,
      examination.date,
      examination.local,
      examination.responsibleDoctor,
      examination.patient
    );

    this.examinationRepository.addExamination(exam);
    return exam;
  }

  findExamById(examId) {
    return this.examinationRepository.getExaminationById(examId);
  }

  findExamByPatientId(patientId) {
    return this.examinationRepository.getExaminationByPatientId(patientId);
  }

  findExamByType(type) {
    return this.examinationRepository.getExaminationByType(type);
  }

  findExamByDate(date) {
    return this.examinationRepository.getExaminationByDate(date);
  }

  updateExam(examId, updatedData) {
    const exam = this.findExamById(examId);
    if (!exam) {
      throw new Error('Examination not found');
    }

    Object.assign(exam, updatedData);
    this.examinationRepository.updateExam(exam);
    return exam;
  }

  deleteExame(examId) {
    const exam = this.findExamById(examId);
    if (!exam) {
      throw new Error('Examination not found');
    }

    this.examinationRepository.deleteExam(examId);
    return exam;
  }
}
