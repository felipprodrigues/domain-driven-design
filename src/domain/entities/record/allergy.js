export class Allergy {
  constructor(type) {
    this.type = type;
  }

  equals(otherAllergies) {
    return this.type === otherAllergies.type;
  }
}
