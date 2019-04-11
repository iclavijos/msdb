import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEngine } from 'app/shared/model/engine.model';

type EntityResponseType = HttpResponse<IEngine>;
type EntityArrayResponseType = HttpResponse<IEngine[]>;

@Injectable({ providedIn: 'root' })
export class EngineService {
    public resourceUrl = SERVER_API_URL + 'api/engines';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/engines';

    constructor(protected http: HttpClient) {}

    create(engine: IEngine): Observable<EntityResponseType> {
        return this.http.post<IEngine>(this.resourceUrl, engine, { observe: 'response' });
    }

    update(engine: IEngine): Observable<EntityResponseType> {
        return this.http.put<IEngine>(this.resourceUrl, engine, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IEngine>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEngine[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEngine[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
