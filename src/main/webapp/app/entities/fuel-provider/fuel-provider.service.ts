import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IFuelProvider } from 'app/shared/model/fuel-provider.model';

type EntityResponseType = HttpResponse<IFuelProvider>;
type EntityArrayResponseType = HttpResponse<IFuelProvider[]>;

@Injectable({ providedIn: 'root' })
export class FuelProviderService {
    public resourceUrl = SERVER_API_URL + 'api/fuel-providers';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/fuel-providers';

    constructor(protected http: HttpClient) {}

    create(fuelProvider: IFuelProvider): Observable<EntityResponseType> {
        return this.http.post<IFuelProvider>(this.resourceUrl, fuelProvider, { observe: 'response' });
    }

    update(fuelProvider: IFuelProvider): Observable<EntityResponseType> {
        return this.http.put<IFuelProvider>(this.resourceUrl, fuelProvider, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IFuelProvider>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IFuelProvider[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IFuelProvider[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
