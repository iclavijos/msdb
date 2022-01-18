import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-rebuild-statistics',
  templateUrl: './rebuildStatistics.component.html'
})
export class JhiRebuildStatisticsComponent implements OnInit {
  finished = false;
  protected resourceUrl = this.applicationConfigService.getEndpointFor('/management/stats/rebuild');

  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  ngOnInit(): void {
    this.http.put<any>(this.resourceUrl, { observe: 'response' }).subscribe(() => this.finishedOk());
  }

  private finishedOk(): void {
    // this.alertService.success('motorsportsDatabaseApp.stats.home.rebuilt', null, null);
    this.finished = true;
  }
}
