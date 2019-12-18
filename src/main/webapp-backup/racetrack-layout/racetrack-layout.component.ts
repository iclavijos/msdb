import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';
import { AccountService } from 'app/core/auth/account.service';
import { RacetrackLayoutService } from './racetrack-layout.service';

@Component({
  selector: 'jhi-racetrack-layout',
  templateUrl: './racetrack-layout.component.html'
})
export class RacetrackLayoutComponent implements OnInit, OnDestroy {
  racetrackLayouts: IRacetrackLayout[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected racetrackLayoutService: RacetrackLayoutService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.racetrackLayoutService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<IRacetrackLayout[]>) => res.ok),
          map((res: HttpResponse<IRacetrackLayout[]>) => res.body)
        )
        .subscribe((res: IRacetrackLayout[]) => (this.racetrackLayouts = res));
      return;
    }
    this.racetrackLayoutService
      .query()
      .pipe(
        filter((res: HttpResponse<IRacetrackLayout[]>) => res.ok),
        map((res: HttpResponse<IRacetrackLayout[]>) => res.body)
      )
      .subscribe((res: IRacetrackLayout[]) => {
        this.racetrackLayouts = res;
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
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInRacetrackLayouts();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IRacetrackLayout) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInRacetrackLayouts() {
    this.eventSubscriber = this.eventManager.subscribe('racetrackLayoutListModification', response => this.loadAll());
  }
}
