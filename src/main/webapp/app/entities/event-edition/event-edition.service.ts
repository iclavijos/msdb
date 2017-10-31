import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { EventEdition } from './event-edition.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventEditionService {

    private resourceUrl = SERVER_API_URL + 'api/event-editions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/event-editions';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(eventEdition: EventEdition): Observable<EventEdition> {
        const copy = this.convert(eventEdition);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(eventEdition: EventEdition): Observable<EventEdition> {
        const copy = this.convert(eventEdition);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<EventEdition> {
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
     * Convert a returned JSON object to EventEdition.
     */
    private convertItemFromServer(json: any): EventEdition {
        const entity: EventEdition = Object.assign(new EventEdition(), json);
        entity.eventDate = this.dateUtils
            .convertLocalDateFromServer(json.eventDate);
        return entity;
    }

    /**
     * Convert a EventEdition to a JSON which can be sent to the server.
     */
    private convert(eventEdition: EventEdition): EventEdition {
        const copy: EventEdition = Object.assign({}, eventEdition);
        copy.eventDate = this.dateUtils
            .convertLocalDateToServer(eventEdition.eventDate);
        return copy;
    }
}
