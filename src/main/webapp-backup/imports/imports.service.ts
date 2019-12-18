import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Imports } from './imports.model';

@Injectable()
export class ImportsService {
  private resourceUrl = 'api/imports';

  constructor(private http: Http) {}

  importCSV(imports: Imports): Observable<Response> {
    return this.http.post(this.resourceUrl, imports);
  }
}
