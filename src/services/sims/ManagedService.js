

import { get, at } from 'lodash';


export class ManagedService{

  constructor(data){

    this.uuid = data.uuid;
    this.href = data.href;
    this.category = data.category;
    this.description = data.description;
    this.endDate = data.endDate ? new Date(data.endDate) : null;
    this.startDate = data.startDate ? new Date(data.startDate) : null;
    this.orderDate = data.orderDate ? new Date(data.orderDate) : null;
    this.hasStarted = data.hasStarted;
    this.isStateful = data.isStateful;
    this.isServiceEnabled = data.isServiceEnabled;
    this.name = data.name;
    this.startMode = data.startMode;
    this.state = data.state;
    this.type = data.type;
    this.supportingService = [];
    this.supportingResource = [];
    this.serviceCharacteristic = [];
    this.relatedParty = [];
    this.serviceRelationship = [];
    this.note = [];
    this.place = [];
    this.serviceSpecification;
  }

  getPatch(){
    const ret = [];

    for (let key in this){
      if(! typeof(get(this, key)) != "object"){
        ret.push({
          path: `/${key}`,
          value: get(this,key),
          op: "replace",
        });
      }
    }

    return ret;
  }

  static fromData(data){
    let service = new ManagedService(data);
    service.id = data.id;

    data.serviceCharacteristic.forEach((e) => {
      service.addServiceCharacteristic(new ServiceCharacteristic(e.name, e.value));
    });
  
    data.serviceRelationship.forEach((e) => {
      service.addServiceRelationship(new ServiceRelationship(e.type, e.service));
    });

    data.supportingService.forEach((e) => {
      service.addSupportingService(new SupportingService(e.id, e.href, e.name, e.category));
    })

    data.supportingResource.forEach((e) => {
      service.addSupportingResource(new SupportingResource(e.id, e.href, e.name));
    });
    data.relatedParty.forEach((e) => {
      service.addRelatedParty(new RelatedParty(e.id, e.role, e.href, e.name));
    });
    data.note.forEach((e) => {
      service.addNote(new Note(e.author, e.date, e.text));
    });
    data.place.forEach((e) => {
      service.addPlace(new Place(e.href, e.role));
    });
    let spec = data.serviceSpecification;
    if(spec){
      service.setServiceSpecification(new ServiceSpecification(spec.id, spec.href, spec.name, spec.version));
    }

    return service;
  }


  toData(){
    return {
      id: this.id,
      uuid:  this.uuid,
      href:  this.href,
      category:  this.category,
      description:  this.description,
      endDate: this.endDate ? this.endDate.toISOString() : null,
      startDate: this.startDate ? this.startDate.toISOString() : null,
      orderDate: this.orderDate ? this.orderDate.toISOString() : null,
      hasStarted:  this.hasStarted,
      isStateful:  this.isStateful,
      isServiceEnabled: this.isServiceEnabled,
      name:  this.name,
      startMode:  this.startMode,
      state:  this.state,
      type:  this.type,
      serviceCharacteristic: this.serviceCharacteristic.map((e) => e.toData()),
      relatedParty: this.relatedParty.map((e) => e.toData()),
      serviceRelationship: this.serviceRelationship.map((e) => e.toData()),
      serviceSpecification: this.serviceSpecification && this.serviceSpecification.toData(),
      supportingResource: this.supportingResource.map((e) => e.toData()),
      supportingService: this.supportingService.map((e) => e.toData()),
      note: this.note.map((e) => e.toData()),
      place: this.place.map((e) => e.toData())
    }
  }

  addRelatedParty(party){
    this.relatedParty.push(party);
  }

  addServiceCharacteristic(characteristic){
    this.serviceCharacteristic.push(characteristic);
  }

  addServiceRelationship(relationship){
    this.serviceRelationship.push(relationship);
  }

  addSupportingResource(resource){
    this.supportingResource.push(resource);
  }
  
  addSupportingService(service){
    this.supportingService.push(service);
  }

  addNote(note){
    this.note.push(note)
  }

  addPlace(place) {
    this.place.push(place)
  }

  setServiceSpecification(spec){
    this.serviceSpecification = spec;
  }

  deleteServiceCharacteristic(characteristic){
    this.serviceCharacteristic = this.serviceCharacteristic.filter((e) => e.id != characteristic.id);
  }

  deleteRelationship(relationship){
    this.supportingResource = this.supportingResource.filter((e) => e.service.id != relationship.service.id);
  }

  deleteRelatedParty(party){
    this.relatedParty = this.relatedParty.filter((e) => e.id != party.id);
  }

  deleteSupportingResource(resource){
    this.supportingResource = this.supportingResource.filter((e) => e.id != resource.id);
  }

  deleteSupportingService(service){
    this.supportingService = this.supportingService.filter((e) => e.id != service.id);
  }

  deleteServiceSpecification(){
    delete this.serviceSpecification;
  }


  getRelatedParty(){
    return this.relatedParty;
  }

  getNote(){
    return this.note;
  }

  getPlace(){
    return this.place;
  }

  getServiceCharacteristic(){
    return this.serviceCharacteristic;
  }

  getServiceRelationship(){
    return this.serviceRelationship;
  }

  getSupportingResource(){
    return this.supportingResource;
  }

  getSupportingService(){
    return this.supportingService;
  }

  getServiceSpecification(){
    return this.serviceSpecification;
  }
  
  static fromObject(data){
    return new ManagedService(data);
  }
}


export class ServiceCharacteristic{
  constructor(name, value){
    this.name = name;
    this.value = value;
  }

  toData(){
    return {
      name: this.name,
      value: this.value
    }
  }
}

export class ServiceSpecification{
  constructor(id, href, name, version){
    this.id = id;
    this.href = href;
    this.name = name;
    this.version = version;
  }

  toData(){
    return {
      id: this.id,
      href: this.href,
      name: this.name,
      version: this.version
    }
  }
}

export class ServiceRelationship{
  constructor(type, service){
    this.type = type;
    this.service = {
      id: service.id,
      href: service.href
    }
  }

  toData(){
    return {
      type: this.type,
      service: {
        id: this.service.id,
        href: this.service.href
      }
    }
  }
}

export class SupportingResource{
  constructor(id, href, name, version){
    this.id = id;
    this.href = href;
    this.name = name;
    this.version = version;
  }

  toData(){
    return {
      id: this.id,
      href: this.href,
      version: this.version,
      name: this.name
    }
  }
}

export class SupportingService{
  constructor(id,href,name,category){
    this.id = id;
    this.href = href;
    this.name = name;
    this.category = category;
  }

  toData(){
    return{
      id: this.id,
      href: this.href,
      name: this.name,
      category: this.category
    }
  }
}


export class RelatedParty{
  constructor(id, role, href, name){
    this.id = id;
    this.role = role;
    this.name = name;
    this.href = href;
  }

  toData(){
    return {
      id: this.id,
      role: this.role,
      href: this.href,
      name: this.name
    }
  }
}

export class Note{
  constructor(author, date, text){
    this.author = author;
    this.date = date;
    this.text = text;
  }

  toData(){
    return {
      author: this.author,
      date: this.date,
      text: this.text
    }
  }
}

export class Place{
  constructor(href, role){
    this.href = href;
    this.role = role;
  }

  toData(){
    return {
      href: this.href,
      role: this.role
    }
  }
}


