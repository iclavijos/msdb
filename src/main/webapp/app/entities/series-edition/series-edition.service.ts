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

    private seriesEdCache: SeriesEdition;
    private cachedId = 0;

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
        if (id === this.cachedId) {
            return Observable.of(this.seriesEdCache);
        }
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            this.seriesEdCache = res.json();
            this.cachedId = id;
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    findEvents(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/events`).map((res: Response) => {
            return res;
        });
    }

    findDriversStandings(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/standings/drivers`).map((res: Response) => {
            return res;
        });
    }

    findTeamsStandings(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/standings/teams`).map((res: Response) => {
            return res;
        });
    }

    findDriversChampions(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/champions/drivers`).map((res: Response) => {
            return res;
        });
    }
    
    findDriversPointsByRace(id: number): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${id}/points`).map((res: Response) => {
            return res;
        });
    }

    addEventToSeries(seriesId: number, eventId: number, racesData: any): Observable<Response> {
        return this.http.post(`${this.resourceUrl}/${seriesId}/events/${eventId}`, racesData).map((res: Response) => {
           return res;
        });
    }

    removeEventFromSeries(seriesId: number, eventId: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${seriesId}/events/${eventId}`).map((res: Response) => {
           return res;
        });
    }

    updateStandings(seriesId: number): Observable<Response> {
        return this.http.post(`${this.resourceUrl}/${seriesId}/standings`, null).map((res: Response) => {
            return res;
         });
    }
    
    setDriversChampions(seriesEditionId: number, selectedDriversId: any) {
    	return this.http.post(`${this.resourceUrl}/${seriesEditionId}/champions/drivers`, selectedDriversId).map((res: Response) => {
    		return res;
    	});
    }

    query(seriesId: number, req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(`api/series/${seriesId}/editions`, options)
            .map((res: any) => this.convertResponse(res));
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
