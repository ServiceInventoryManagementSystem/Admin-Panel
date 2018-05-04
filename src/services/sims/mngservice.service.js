import { HttpServiceInterface, ConfigServiceInterface } from 'services';

import { ManagedService } from './ManagedService';
import { IManagedService } from './mngservice.interface';

import { DEFAULT_API } from 'common/constants';

import { Observable } from 'rxjs';


export class ManagedServiceServiceProvider extends IManagedService{
  constructor(serviceManager){
    super();
    this.http = serviceManager.getService(HttpServiceInterface);
    this.config = serviceManager.getService(ConfigServiceInterface);
  }

  search(params){
    let endpoint = new URL('service',`${this.config.getItem("SIMS-BASE") || DEFAULT_API}`);
    const searchParams = new URLSearchParams(params);
    endpoint = new URL(`?${searchParams.toString()}`,endpoint);
    return this.http.get(endpoint).map(
      (services) => {
        return services.map(elem => {
          return ManagedService.fromData(elem)
        });
      }
    )
  }




  getServices(){
    // May want to move url to argument
    const endpoint = new URL('service',`${this.config.getItem("SIMS-BASE") || DEFAULT_API}`);
    return this.http.get(endpoint).map(
      (services) => {
        return services.map(elem => {
          return ManagedService.fromData(elem);
        });
      }
    );
  }

  updateService(service){
    const endpoint = new URL(`service`,`${this.config.getItem("SIMS-BASE") || DEFAULT_API}`);
    const patches = service.getPatch();
    return Observable.from(patches).flatMap((op)=> {
      return this.http.patch(endpoint,op);
    }).bufferCount(patches.length);
  }


  postService(service){
    const endpoint = new URL(`service`,`${this.config.getItem("SIMS-BASE") || DEFAULT_API}`);
    return this.http.post(endpoint, service.toData()).map((data) => {
      return ManagedService.fromData(data);
    });
  }

  getService(id){
    const endpoint = new URL(`service/${id}`,`${this.config.getItem("SIMS-BASE") || DEFAULT_API}`);
    return this.http.get(endpoint).map(
      (service) => {
        return new ManagedService.fromData(service);
      }
    );
  }

  deleteService(service){
    if(service.id){
      const endpoint = new URL(`service/${service.id}`,`${this.config.getItem("SIMS-BASE") || DEFAULT_API}`);
      return this.http.delete(endpoint);
    }
    return Observable.throw(new Error("Service has no id"));
  }

  deleteAll(){
      const endpoint = new URL(`service`,`${this.config.getItem("SIMS-BASE") || DEFAULT_API}`);
      return this.http.delete(endpoint);
  }

  seedServices(){
    const endpoint = new URL(`seed/50`,`${this.config.getItem("SIMS-BASE") || DEFAULT_API}`);
    return this.http.get(endpoint);
  }

}