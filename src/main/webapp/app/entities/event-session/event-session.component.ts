import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IEventSession } from 'app/shared/model/event-session.model';
import { EventSessionService } from './event-session.service';

@Component({
  selector: 'jhi-event-session',
  templateUrl: './event-session.component.html'
})
export class EventSessionComponent implements OnInit, OnDestroy {
  eventSessions: IEventSession[];
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected eventSessionService: EventSessionService,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.eventSessionService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IEventSession[]>) => (this.eventSessions = res.body));
      return;
    }
    this.eventSessionService.query().subscribe((res: HttpResponse<IEventSession[]>) => {
      this.eventSessions = res.body;
      this.currentSearch = '';
    });
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInEventSessions();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEventSession) {
    return item.id;
  }

  registerChangeInEventSessions() {
    this.eventSubscriber = this.eventManager.subscribe('eventSessionListModification', () => this.loadAll());
  }
}
