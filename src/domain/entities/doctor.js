import { WorkingHours } from '../value-objects/workingHours.js';

export class Doctor {
  constructor(
    id,
    rcm = '',
    name = '',
    specialty = [],
    phoneNumber = '',
    availableHours
  ) {
    this.id = id;
    this.rcm = rcm;
    this.name = name;
    this.specialty = Array.isArray(specialty) ? specialty : [];
    this.phoneNumber = phoneNumber;
    this.workingHours = new WorkingHours();
  }
}
