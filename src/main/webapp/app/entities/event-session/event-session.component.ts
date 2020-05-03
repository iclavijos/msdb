import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { EventEdition } from 'app/shared/model/event-edition.model';
import { IEventSession } from 'app/shared/model/event-session.model';
import { EventSessionService } from './event-session.service';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import moment from 'moment-timezone';

@Component({
  selector: 'jhi-event-session',
  templateUrl: './event-session.component.html'
})
export class EventSessionComponent implements OnInit, OnDestroy {
  @Input() eventEdition: EventEdition;
  eventSessions: IEventSession[];
  currentAccount: any;
  eventSubscriber: Subscription;
  links: any;
  totalItems: any;
  sessionTypes = SessionType;
  durationTypes = DurationType;
  showPointsResult = false;
  convertedTime = false;
  @Output() showPoints = new EventEmitter<boolean>();
  @Output() sessions = new EventEmitter<IEventSession[]>();

  displayedColumns: string[] = ['sessionStartTime', 'name', 'duration', 'buttons'];
  footerColumns: string[] = ['empty', 'empty', 'empty', 'timeConverter'];

  resultsLength = 0;
  isLoadingResults = true;

  constructor(
    protected eventSessionService: EventSessionService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.registerChangeInEventSessions();
    this.loadAll();
  }

  loadAll() {
    let showPoints = false;
    this.eventSessions = [];
    this.eventSessionService.findSessions(this.eventEdition.id, this.eventEdition.trackLayout.racetrack.timeZone).subscribe(sessions => {
      this.eventSessions = sessions.body;
      this.eventSessions.forEach(
        item => (showPoints = showPoints || (item.pointsSystemsSession !== null && item.pointsSystemsSession.length > 0))
      );
      this.showPoints.emit(showPoints);
      this.sessions.emit(this.eventSessions);
    });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInEventSessions() {
    this.eventSubscriber = this.eventManager.subscribe('eventSessionsListModification', () => this.loadAll());
  }

  convertToCurrentTZ() {
    const currentTZ = moment.tz.guess();
    const clonedSessions = [];
    this.eventSessions.forEach(val => clonedSessions.push(Object.assign({}, val)));
    for (const session of clonedSessions) {
      session.sessionStartTime = session.sessionStartTime = session.sessionStartTime.tz(currentTZ);
    }
    this.convertedTime = true;
    this.eventSessions = clonedSessions;
  }

  convertToLocalTZ() {
    const clonedSessions = [];
    this.eventSessions.forEach(val => clonedSessions.push(Object.assign({}, val)));
    for (const session of clonedSessions) {
      session.sessionStartTime = session.sessionStartTime.tz(this.eventEdition.trackLayout.racetrack.timeZone);
    }
    this.convertedTime = false;
    this.eventSessions = clonedSessions;
  }
}
