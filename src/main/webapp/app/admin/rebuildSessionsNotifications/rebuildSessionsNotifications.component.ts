import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';

@Component({
  selector: 'jhi-rebuild-sessions-notifs',
  templateUrl: './rebuildSessionsNotifications.component.html'
})
export class JhiRebuildSessionsNotificationsComponent implements OnInit {
  finished: boolean;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.finished = false;

    this.http.put<any>(SERVER_API_URL + '/management/notifications/rebuild', { observe: 'response' }).subscribe(() => this.finishedOk());
  }

  private finishedOk() {
    this.finished = true;
  }
}
