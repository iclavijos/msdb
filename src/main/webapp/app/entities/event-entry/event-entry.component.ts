import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IEventEntry } from 'app/shared/model/event-entry.model';
import { EventEntryService } from './event-entry.service';

@Component({
  selector: 'jhi-event-entry',
  templateUrl: './event-entry.component.html'
})
export class EventEntryComponent implements OnInit, OnDestroy {
  eventEntries: IEventEntry[];
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected eventEntryService: EventEntryService,
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
      this.eventEntryService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IEventEntry[]>) => (this.eventEntries = res.body));
      return;
    }
    this.eventEntryService.query().subscribe((res: HttpResponse<IEventEntry[]>) => {
      this.eventEntries = res.body;
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
    this.registerChangeInEventEntries();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEventEntry) {
    return item.id;
  }

  registerChangeInEventEntries() {
    this.eventSubscriber = this.eventManager.subscribe('eventEntryListModification', () => this.loadAll());
  }
}
