import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { SeriesEdition } from './series-edition.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class SeriesEditionService {

    private resourceUrl = SERVER_API_URL + 'api/series-editions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/series-editions';

    constructor(private http: Http) { }

    create(seriesEdition: SeriesEdition): Observable<SeriesEdition> {
        const copy = this.convert(seriesEdition);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(seriesEdition: SeriesEdition): Observable<SeriesEdition> {
        const copy = this.convert(seriesEdition);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<SeriesEdition> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
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
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to SeriesEdition.
     */
    private convertItemFromServer(json: any): SeriesEdition {
        const entity: SeriesEdition = Object.assign(new SeriesEdition(), json);
        return entity;
    }

    /**
     * Convert a SeriesEdition to a JSON which can be sent to the server.
     */
    private convert(seriesEdition: SeriesEdition): SeriesEdition {
        const copy: SeriesEdition = Object.assign({}, seriesEdition);
        return copy;
    }
}
