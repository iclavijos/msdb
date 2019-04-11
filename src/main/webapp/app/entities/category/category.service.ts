import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICategory } from 'app/shared/model/category.model';

type EntityResponseType = HttpResponse<ICategory>;
type EntityArrayResponseType = HttpResponse<ICategory[]>;

@Injectable({ providedIn: 'root' })
export class CategoryService {
    public resourceUrl = SERVER_API_URL + 'api/categories';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/categories';

    constructor(protected http: HttpClient) {}

    create(category: ICategory): Observable<EntityResponseType> {
        return this.http.post<ICategory>(this.resourceUrl, category, { observe: 'response' });
    }

    update(category: ICategory): Observable<EntityResponseType> {
        return this.http.put<ICategory>(this.resourceUrl, category, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICategory[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICategory[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
