import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    this.http.get<any>('/management/stats/rebuild').subscribe((res: HttpResponse<any>) => this.finishedOk());
  }

  private finishedOk() {
    this.alertService.success('motorsportsDatabaseApp.stats.home.rebuilt', null, null);
    this.finished = true;
  }
}
