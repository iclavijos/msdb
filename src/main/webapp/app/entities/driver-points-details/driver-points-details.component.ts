import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IDriverPointsDetails } from 'app/shared/model/driver-points-details.model';
import { DriverPointsDetailsService } from './driver-points-details.service';

@Component({
  selector: 'jhi-driver-points-details',
  templateUrl: './driver-points-details.component.html'
})
export class DriverPointsDetailsComponent implements OnInit, OnDestroy {
  driverPointsDetails: IDriverPointsDetails[];
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected driverPointsDetailsService: DriverPointsDetailsService,
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
      this.driverPointsDetailsService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IDriverPointsDetails[]>) => (this.driverPointsDetails = res.body));
      return;
    }
    this.driverPointsDetailsService.query().subscribe((res: HttpResponse<IDriverPointsDetails[]>) => {
      this.driverPointsDetails = res.body;
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
    this.registerChangeInDriverPointsDetails();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IDriverPointsDetails) {
    return item.id;
  }

  registerChangeInDriverPointsDetails() {
    this.eventSubscriber = this.eventManager.subscribe('driverPointsDetailsListModification', () => this.loadAll());
  }
}
