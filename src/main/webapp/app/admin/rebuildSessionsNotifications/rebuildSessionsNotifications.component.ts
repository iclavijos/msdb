import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-rebuild-sessions-notifs',
  templateUrl: './rebuildSessionsNotifications.component.html'
})
export class JhiRebuildSessionsNotificationsComponent implements OnInit {
  finished = false;
  protected resourceUrl = this.applicationConfigService.getEndpointFor('/management/notifications/rebuild');

  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  ngOnInit() {
    this.http.put<any>(this.resourceUrl, { observe: 'response' }).subscribe(() => this.finishedOk());
  }

  private finishedOk() {
    this.finished = true;
  }
}
