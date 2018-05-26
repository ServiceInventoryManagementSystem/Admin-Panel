
import {Subject} from 'rxjs';

export class ErrorService {

  constructor(){
    this.errorSubject = new Subject();
  }

  pushErrorEvent (error) {
    this.errorSubject.next(error)

  }

  getErrorEvents (type) {
    return this.errorSubject.filter( (error) => {
      return error.type == type;
    })
  }

}