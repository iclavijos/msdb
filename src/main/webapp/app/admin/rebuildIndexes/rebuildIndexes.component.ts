import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';

@Component({
  selector: 'jhi-rebuild-indexes',
  templateUrl: './rebuildIndexes.component.html'
})
export class JhiRebuildIndexesComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(SERVER_API_URL + '/management/indexes/rebuild', { observe: 'response' }).subscribe();
  }
}
