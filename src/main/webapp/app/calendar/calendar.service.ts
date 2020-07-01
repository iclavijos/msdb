import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class CalendarService {
  constructor(private http: Http) {}
}
