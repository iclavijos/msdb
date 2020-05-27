import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { EventEdition } from 'app/shared/model/event-edition.model';
import { IEventSession, EventSession } from 'app/shared/model/event-session.model';
import { EventSessionUpdateComponent } from './event-session-update.component';
import { EventSessionDeleteDialogComponent } from './event-session-delete-dialog.component';
import { EventSessionService } from './event-session.service';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment-timezone';

@Component({
  selector: 'jhi-event-session',
  templateUrl: './event-session.component.html'
})
export class EventSessionComponent implements OnInit {
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
    private dialog: MatDialog
  ) {}

  ngOnInit() {
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

  createSession() {
    const newSession = new EventSession();
    newSession.eventEdition = this.eventEdition;
    const dialogRef = this.dialog.open(EventSessionUpdateComponent, {
      data: {
        eventSession: newSession
      }
    });

    dialogRef.afterClosed().subscribe(newEventSession => {
      if (newEventSession) {
        this.loadAll();
      }
    });
  }

  editSession(session: IEventSession) {
    session.eventEdition = this.eventEdition;
    const dialogRef = this.dialog.open(EventSessionUpdateComponent, {
      data: {
        eventEditionId: this.eventEdition.id,
        eventSession: session
      }
    });

    dialogRef.afterClosed().subscribe(updatedEventSession => {
      if (updatedEventSession) {
        this.loadAll();
      }
    });
  }

  deleteSession(session: IEventSession) {
    const dialogRef = this.dialog.open(EventSessionDeleteDialogComponent, {
      data: {
        eventSession: session
      }
    });

    dialogRef.afterClosed().subscribe(idToDelete => {
      if (idToDelete) {
        this.eventSessionService.delete(session.id).subscribe(() => {
          this.loadAll();
        });
      }
    });
  }

  convertToCurrentTZ() {
    const currentTZ = moment.tz.guess();
    const clonedSessions = [];
    this.eventSessions.forEach(val => clonedSessions.push(Object.assign({}, val)));
    for (const session of clonedSessions) {
      session.sessionStartTime = session.sessionStartTime.tz(currentTZ);
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
