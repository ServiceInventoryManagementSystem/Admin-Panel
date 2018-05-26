import { HttpServiceInterface } from './http.interface';


import { Observable, Subject } from 'rxjs';


export class HttpServiceProvider extends HttpServiceInterface{

  constructor(serviceManager) {
    super();
    this.requestQueue = [];
    this.requestSubject = new Subject();
    this.count = 0;
    // Subject for handling requests, each request is seperated by 150ms
    // Prevents 'DOS' protection
    this.requestSubject
      // Limit throughput by 150ms
      .concatMap(v => Observable.of(v).delay(150))
      // Subscrive to this stream
      .subscribe((requestPair) => {
        // preforme request
        this.count++;
        Observable.fromPromise(fetch(requestPair.request))
          /*
            Send response to handleResponse()
            handleResponse will resolve
          */
          .flatMap(response => this.handleResponse(response))
          // When the request is resolved, send it back to the source of the request
          .subscribe((r) => {
            requestPair.subject.next(r);
          }, (error) => {
            requestPair.subject.error(error);
          }, () => {
            requestPair.subject.complete();
          });
      });
  }

  setToken(token) {
    /*this.auth_token = token;
    this.token_type = "Bearer";*/
  }

  setAuthMethod(authenticator) {
    this.authenticator = authenticator;
  }

  handleResponse(r) {
    if (!r.ok) {
      console.log(r);
      return Observable.throw(r);
    }
    return Observable.fromPromise(r.clone().json()).catch((err) => {
      return r.text();
    });
  }
  /** Performs a general request
   * @param {Request} url
   * @return Observable<{}>
   */
  request(request) {
    // Add token to request
    if(this.authenticator){
      request = this.authenticator(request);
      //request.headers.set('Authorization', `${this.token_type} ${this.auth_token}`);
    }
    const resolver = new Subject();
    // Push request into request 'stream'/queue
    this.requestSubject.next({ request, subject: resolver });
    return resolver.asObservable();
  }
  /** performes a get request
   * @param {string} url
   * @param {params} {key: value}
   * @return Observable<{}>
   */
  get(url, params) {
    let pUrl = url;
    if (params) {
      pUrl += HttpServiceProvider.urlEncode(params);
    }
    // Create request
    const request = new Request(pUrl, { method: 'GET' });
    return this.request(request);
  }

  static urlEncode(data) {
    let ret = '';
    for (const key in data) {
      if (ret != '') {
        ret += '&';
      }
      ret += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
    }
    return `?${ret}`;
  }
  
  /** Performs a post request
   * @param {string} url
   * @param {params} {key: value}
   * @param {boolean} url_encoded
   * @return Observable<{}>
   */
  post(url, body, url_encoded, ctype) {
    let pUrl = url;
    let pBody = body;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (url_encoded) {
      pUrl += HttpServiceProvider.urlEncode(pBody);
      headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      pBody = null;
    } else {
      pBody = JSON.stringify(pBody);
    }

    if(ctype){
      headers.set('Content-Type', ctype);
    }
    // Create request
    const request = new Request(pUrl, {
      method: 'POST',
      body: pBody,
      headers,
    });
    return this.request(request);
  }
  delete(url){
    const request = new Request(url, {
      method: 'DELETE'
    });
    return this.request(request);
  }


  patch(url, body, ctype){
    console.log(body);
    const request = new Request(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    if(ctype){
      request.headers.set('Content-Type', ctype);
    }
    return this.request(request);
  }
}