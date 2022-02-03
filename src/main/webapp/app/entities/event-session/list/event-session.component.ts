import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventEdition } from 'app/entities/event-edition/event-edition.model';
import { IEventSession, EventSession } from '../event-session.model';
import { EventSessionUpdateComponent } from '../update/event-session-update.component';
import { EventSessionDeleteDialogComponent } from '../delete/event-session-delete-dialog.component';
import { EventSessionService } from '../service/event-session.service';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { MatTableDataSource } from '@angular/material/table';

import * as dayjs from 'dayjs';

@Component({
  selector: 'jhi-event-session',
  templateUrl: './event-session.component.html',
})
export class EventSessionComponent implements OnInit, OnChanges {
  @Input() eventEdition!: IEventEdition;
  isLoading = false;
  totalItems = 0;
  sessionTypes = SessionType;
  durationTypes = DurationType;
  showPointsResult = false;
  convertedTime = false;
  @Output() showPoints = new EventEmitter<boolean>();
  @Output() sessions = new EventEmitter<IEventSession[]>();

  displayedColumns: string[] = ['sessionStartTime', 'name', 'duration'];
  footerColumns: string[] = ['empty', 'empty', 'empty', 'timeConverter'];

  dataSource = new MatTableDataSource<IEventSession>([]);

  timeZone: any;

  constructor(
    protected eventSessionService: EventSessionService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    if (this.eventEdition.event?.raid) {
      this.displayedColumns.push('totalDuration');
    }
    this.displayedColumns.push('buttons');
    if (!this.eventEdition.event?.rally && !this.eventEdition.event?.raid) {
      this.timeZone = this.eventEdition.trackLayout!.racetrack!.timeZone;
    } else if (this.eventEdition.event.rally) {
      this.timeZone = this.eventEdition.locationTimeZone;
    }
    this.loadAll();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['eventEdition'];

    if (change.previousValue) {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.isLoading = true;
    this.eventSessionService.findSessions(this.eventEdition.id!, this.timeZone)
      .subscribe(
        (res: HttpResponse<IEventSession[]>) => {
          this.isLoading = false;
          this.dataSource.data = res.body ?? [];
          let showPoints = false;
          this.dataSource.data.forEach(
            (item: IEventSession) =>
              (showPoints = showPoints ||
                (item.pointsSystemsSession !== null &&
                  item.pointsSystemsSession.length > 0))
          );
          this.showPoints.emit(showPoints);
          this.sessions.emit(this.dataSource.data);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  createSession(): void {
    const modalRef = this.modalService.open(EventSessionUpdateComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventSession = new EventSession();
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'edit') {
        this.loadAll();
      }
    });
  }

  editSession(eventSession: IEventSession): void {
    const modalRef = this.modalService.open(EventSessionUpdateComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventEditionId = this.eventEdition.id;
    modalRef.componentInstance.session = eventSession;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'edit') {
        this.loadAll();
      }
    });
  }

  delete(eventSession: IEventSession): void {
    const modalRef = this.modalService.open(EventSessionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventSession = eventSession;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  convertToCurrentTZ(): void {
    const currentTZ = dayjs.tz.guess();
    const clonedSessions: IEventSession[] = [];
    this.dataSource.data.forEach((val: IEventSession) => clonedSessions.push(Object.assign({}, val)));
    for (const session of clonedSessions) {
      const tmp = session.sessionStartTime!.utc();
      session.sessionStartTime = tmp.tz(currentTZ);
    }
    this.convertedTime = true;
    this.dataSource.data = clonedSessions;
  }

  convertToLocalTZ(): void {
    const clonedSessions: IEventSession[] = [];
    this.dataSource.data.forEach((val: IEventSession) => clonedSessions.push(Object.assign({}, val)));
    const timeZone =
      !this.eventEdition.event?.rally && !this.eventEdition.event?.raid
        ? this.eventEdition.trackLayout?.racetrack?.timeZone
        : this.eventEdition.event.rally
        ? this.eventEdition.locationTimeZone
        : null;
    for (const session of clonedSessions) {
      if (timeZone) {
        session.sessionStartTime = session.sessionStartTime!.tz(timeZone);
      } else {
        session.sessionStartTime = session.sessionStartTime!.tz(session.locationTimeZone);
      }
    }
    this.convertedTime = false;
    this.dataSource.data = clonedSessions;
  }
}
