import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICountry } from './country.model';

export type EntityResponseType = HttpResponse<ICountry>;
export type EntityArrayResponseType = HttpResponse<ICountry[]>;

@Injectable({ providedIn: 'root' })
export class CountryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/countries');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_typeahead/countries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  searchCountries(query: string): Observable<EntityArrayResponseType> {
    return this.http.get<ICountry[]>(`${this.resourceSearchUrl}?query=${query}`, { observe: 'response' });
  }

  getCountry(countryCode: string): Observable<EntityResponseType> {
    return this.http.get<ICountry>(`${this.resourceUrl}/${countryCode}`, { observe: 'response' });
  }
}
