import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Imports } from './imports.model';

@Injectable()
export class ImportsService {

    private resourceUrl = 'api/imports';

    constructor(private http: Http) { }

    importCSV(imports: Imports) {
        this.http.post(this.resourceUrl, imports)
            .map((res: Response) => res)
            .subscribe((res: any) => res);
    }

}
