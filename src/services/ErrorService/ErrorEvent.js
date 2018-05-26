

export class ErrorEvent {

  constructor(name, type, description, payload) {
    this.name = name;
    this.type = type;
    this.payload = payload;
    this.description = description;
  }

}