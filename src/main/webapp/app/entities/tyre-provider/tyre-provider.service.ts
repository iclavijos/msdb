import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { TyreProvider } from './tyre-provider.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class TyreProviderService {

    private resourceUrl = SERVER_API_URL + 'api/tyre-providers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/tyre-providers';
    private typeaheadSearchUrl= 'api/_typeahead/tyres';

    constructor(private http: Http) { }

    create(tyreProvider: TyreProvider): Observable<TyreProvider> {
        const copy = this.convert(tyreProvider);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(tyreProvider: TyreProvider): Observable<TyreProvider> {
        const copy = this.convert(tyreProvider);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<TyreProvider> {
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
     * Convert a returned JSON object to TyreProvider.
     */
    private convertItemFromServer(json: any): TyreProvider {
        const entity: TyreProvider = Object.assign(new TyreProvider(), json);
        return entity;
    }

    /**
     * Convert a TyreProvider to a JSON which can be sent to the server.
     */
    private convert(tyreProvider: TyreProvider): TyreProvider {
        const copy: TyreProvider = Object.assign({}, tyreProvider);
        return copy;
    }
}
