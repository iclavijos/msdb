import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { EventEdition } from 'app/shared/model/event-edition.model';
import { IEventSession } from 'app/shared/model/event-session.model';
import { EventSessionService } from './event-session.service';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

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
  showPoints = false;
  @Output() showPointsEmitter = new EventEmitter<boolean>();

  displayedColumns: string[] = ['sessionStartTime', 'name', 'duration', 'buttons'];

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
    this.eventSessions = [];
    this.eventSessionService
      .findSessions(this.eventEdition.id, this.eventEdition.trackLayout.racetrack.timeZone)
      .subscribe(sessions => (this.eventSessions = sessions.body));
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEventSession) {
    return item.id;
  }

  registerChangeInEventSessions() {
    this.eventSubscriber = this.eventManager.subscribe('eventSessionsListModification', () => this.loadAll());
  }

  //     sorting() {
  //       const result = [this.sort.active + ',' + this.sort.direction];
  //       if (this.predicate !== 'id') {
  //         result.push('id');
  //       }
  //       return result;
  //     }
}
