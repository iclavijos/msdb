import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';

type EntityResponseType = HttpResponse<IEventEntryResult>;
type EntityArrayResponseType = HttpResponse<IEventEntryResult[]>;

@Injectable({ providedIn: 'root' })
export class EventEntryResultService {
    public resourceUrl = SERVER_API_URL + 'api/event-entry-results';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/event-entry-results';

    constructor(protected http: HttpClient) {}

    create(eventEntryResult: IEventEntryResult): Observable<EntityResponseType> {
        return this.http.post<IEventEntryResult>(this.resourceUrl, eventEntryResult, { observe: 'response' });
    }

    update(eventEntryResult: IEventEntryResult): Observable<EntityResponseType> {
        return this.http.put<IEventEntryResult>(this.resourceUrl, eventEntryResult, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IEventEntryResult>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEventEntryResult[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEventEntryResult[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
