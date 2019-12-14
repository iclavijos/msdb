import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-rebuild-indexes',
  templateUrl: './rebuildIndexes.component.html'
})
export class JhiRebuildIndexesComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('/management/indexes/rebuild').subscribe((res: HttpResponse<any>) => res.body);
  }
}
