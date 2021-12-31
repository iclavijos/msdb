import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from '../constants/input.constants';

import { SERVER_API_URL } from '../../app.constants';
import { ICountry } from '../country/country.model';

type EntityResponseType = HttpResponse<ICountry>;
type EntityArrayResponseType = HttpResponse<ICountry[]>;

@Injectable({ providedIn: 'root' })
export class CountryService {
  public resourceUrl = SERVER_API_URL + 'api/countries';
  public resourceSearchUrl = SERVER_API_URL + 'api/_typeahead/countries';

  constructor(protected http: HttpClient) {}

  searchCountries(query?: any): Observable<EntityArrayResponseType> {
    return this.http.get<ICountry[]>(`${this.resourceSearchUrl}?query=${query}`, { observe: 'response' });
  }

  getCountry(countryCode: string): Observable<EntityResponseType> {
    return this.http.get<ICountry>(`${this.resourceUrl}/${countryCode}`, { observe: 'response' });
  }
}
