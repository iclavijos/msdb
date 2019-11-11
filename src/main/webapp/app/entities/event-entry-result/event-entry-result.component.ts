import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
  selector: 'jhi-event-entry-result',
  templateUrl: './event-entry-result.component.html'
})
export class EventEntryResultComponent implements OnInit, OnDestroy {
  eventEntryResults: IEventEntryResult[];
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected eventEntryResultService: EventEntryResultService,
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
      this.eventEntryResultService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IEventEntryResult[]>) => (this.eventEntryResults = res.body));
      return;
    }
    this.eventEntryResultService.query().subscribe((res: HttpResponse<IEventEntryResult[]>) => {
      this.eventEntryResults = res.body;
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
    this.registerChangeInEventEntryResults();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEventEntryResult) {
    return item.id;
  }

  registerChangeInEventEntryResults() {
    this.eventSubscriber = this.eventManager.subscribe('eventEntryResultListModification', () => this.loadAll());
  }
}
