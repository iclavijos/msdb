import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { FuelProvider } from './fuel-provider.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class FuelProviderService {

    private resourceUrl = SERVER_API_URL + 'api/fuel-providers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/fuel-providers';
    private typeaheadSearchUrl= 'api/_typeahead/fuel';

    constructor(private http: Http) { }

    create(fuelProvider: FuelProvider): Observable<FuelProvider> {
        const copy = this.convert(fuelProvider);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(fuelProvider: FuelProvider): Observable<FuelProvider> {
        const copy = this.convert(fuelProvider);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<FuelProvider> {
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

    typeahead(req?: string): Observable<ResponseWrapper> {
        return this.http.get(`${this.typeaheadSearchUrl}?query=${req}`)
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
     * Convert a returned JSON object to FuelProvider.
     */
    private convertItemFromServer(json: any): FuelProvider {
        const entity: FuelProvider = Object.assign(new FuelProvider(), json);
        return entity;
    }

    /**
     * Convert a FuelProvider to a JSON which can be sent to the server.
     */
    private convert(fuelProvider: FuelProvider): FuelProvider {
        const copy: FuelProvider = Object.assign({}, fuelProvider);
        return copy;
    }
}
