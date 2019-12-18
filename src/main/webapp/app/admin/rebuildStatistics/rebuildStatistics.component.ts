import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';

import { JhiAlertService } from 'ng-jhipster';

@Component({
  selector: 'jhi-rebuild-statistics',
  templateUrl: './rebuildStatistics.component.html'
})
export class JhiRebuildStatisticsComponent implements OnInit {
  finished: boolean;

  constructor(private http: HttpClient, private alertService: JhiAlertService) {}

  ngOnInit() {
    this.finished = false;

    this.http.get<any>(SERVER_API_URL + '/management/stats/rebuild', { observe: 'response' }).subscribe(() => this.finishedOk());
  }

  private finishedOk() {
    this.alertService.success('motorsportsDatabaseApp.stats.home.rebuilt', null, null);
    this.finished = true;
  }
}
