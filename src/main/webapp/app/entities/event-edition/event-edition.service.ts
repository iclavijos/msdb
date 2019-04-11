import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEventEdition } from 'app/shared/model/event-edition.model';

type EntityResponseType = HttpResponse<IEventEdition>;
type EntityArrayResponseType = HttpResponse<IEventEdition[]>;

@Injectable({ providedIn: 'root' })
export class EventEditionService {
    public resourceUrl = SERVER_API_URL + 'api/event-editions';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/event-editions';

    constructor(protected http: HttpClient) {}

    create(eventEdition: IEventEdition): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(eventEdition);
        return this.http
            .post<IEventEdition>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(eventEdition: IEventEdition): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(eventEdition);
        return this.http
            .put<IEventEdition>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IEventEdition>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEventEdition[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEventEdition[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(eventEdition: IEventEdition): IEventEdition {
        const copy: IEventEdition = Object.assign({}, eventEdition, {
            eventDate:
                eventEdition.eventDate != null && eventEdition.eventDate.isValid() ? eventEdition.eventDate.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.eventDate = res.body.eventDate != null ? moment(res.body.eventDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((eventEdition: IEventEdition) => {
                eventEdition.eventDate = eventEdition.eventDate != null ? moment(eventEdition.eventDate) : null;
            });
        }
        return res;
    }
}
