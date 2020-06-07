import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

export class Imports {
  constructor(public csvContents?: any, public importType?: string, public associatedId?: any) {}
}

@Injectable()
export class ImportsService {
  private resourceUrl = 'api/imports';

  constructor(private http: HttpClient) {}

  importCSV(imports: Imports): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl, imports);
  }
}
