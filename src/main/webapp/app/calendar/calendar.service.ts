import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CalendarService {
  constructor(private http: HttpClient) {}
}
