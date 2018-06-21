import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { DriverPointsDetails } from './driver-points-details.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class DriverPointsDetailsService {

    private resourceUrl = SERVER_API_URL + 'api/driver-points-details';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/driver-points-details';

    constructor(private http: Http) { }

    create(driverPointsDetails: DriverPointsDetails): Observable<DriverPointsDetails> {
        const copy = this.convert(driverPointsDetails);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(driverPointsDetails: DriverPointsDetails): Observable<DriverPointsDetails> {
        const copy = this.convert(driverPointsDetails);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<DriverPointsDetails> {
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
     * Convert a returned JSON object to DriverPointsDetails.
     */
    private convertItemFromServer(json: any): DriverPointsDetails {
        const entity: DriverPointsDetails = Object.assign(new DriverPointsDetails(), json);
        return entity;
    }

    /**
     * Convert a DriverPointsDetails to a JSON which can be sent to the server.
     */
    private convert(driverPointsDetails: DriverPointsDetails): DriverPointsDetails {
        const copy: DriverPointsDetails = Object.assign({}, driverPointsDetails);
        return copy;
    }
}
