import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SeriesEdition } from './series-edition.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class SeriesEditionService {

    private resourceUrl = 'api/series-editions';
    private resourceSearchUrl = 'api/_search/series-editions';

    constructor(private http: Http) { }

    create(seriesEdition: SeriesEdition): Observable<SeriesEdition> {
        const copy = this.convert(seriesEdition);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(seriesEdition: SeriesEdition): Observable<SeriesEdition> {
        const copy = this.convert(seriesEdition);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<SeriesEdition> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(seriesEdition: SeriesEdition): SeriesEdition {
        const copy: SeriesEdition = Object.assign({}, seriesEdition);
        return copy;
    }
}
