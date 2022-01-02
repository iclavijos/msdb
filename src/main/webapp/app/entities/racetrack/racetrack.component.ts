import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { IRacetrack } from '../../shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { icon, latLng, Marker, tileLayer } from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'jhi-racetrack',
  templateUrl: './racetrack.component.html',
  styleUrls: ['./racetrack.component.scss']
})
export class RacetrackComponent implements AfterViewInit, OnDestroy {
  currentAccount: any;
  racetracks: IRacetrack[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  displayedColumns: string[] = ['name', 'location', 'logo', 'buttons'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    }
  };

  map: L.Map;
  mapOptions = {
    maxBounds: [[-90, -180], [90, 180]],
    worldCopyJump: true,
    center: latLng(0, 0),
    zoom: 2,
    layers: [this.streetMaps]
  };

  constructor(
    protected racetrackService: RacetrackService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected ngZone: NgZone,
    protected elementRef: ElementRef
  ) {
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  ngAfterViewInit() {
    this.registerChangeInRacetracks();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<IRacetrack[]>) => {
          this.isLoadingResults = false;
          return this.processRacetracksResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.racetracks = data));
  }

  onMapReady(newMap: L.Map) {
    setTimeout(() => {
      this.map.invalidateSize();
    });
    this.map = newMap;
    this.addMapMarkers();
  }

  private addMapMarkers() {
    this.racetrackService
      .query({
        page: 0,
        size: 500
      })
      .subscribe(data =>
        data.body.forEach(rt => {
          const racetrackLocation = new Marker([rt.latitude, rt.longitude])
            .setIcon(
              icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: 'assets/marker-icon.png'
              })
            )
            .on('popupopen', $event => {
              this.navigateFromPopup($event.target.options.trackId, this.elementRef);
            });
          L.Util.setOptions(racetrackLocation, { trackId: rt.id });
          const logo = rt.logoUrl ? `<img src=${rt.logoUrl} style="max-height: 200px; max-width: 200px"><br/>` : '';
          let popup = `<p align="center">${logo}<h4>${rt.name}</h4><br/>${rt.location}, ${rt.countryCode}<br/></p>`;
          popup = popup + `<a id="mapLink" href="javascript:void">Link</a>`;
          racetrackLocation.addTo(this.map).bindPopup(popup, { minWidth: 220 });
        })
      );
  }

  private navigateFromPopup(trackId, elementRef: ElementRef) {
    elementRef.nativeElement.querySelector('#mapLink').addEventListener('click', () => {
      this.ngZone.run(() => {
        this.router.navigate(['/racetrack', trackId, 'view']);
      });
    });
  }

  private processRacetracksResponse(racetracks: HttpResponse<IRacetrack[]>) {
    this.resultsLength = parseInt(racetracks.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(racetracks.headers.get('link'));
    this.totalItems = parseInt(racetracks.headers.get('X-Total-Count'), 10);
    return racetracks.body;
  }

  loadAll() {
    this.currentSearch = sessionStorage.getItem('racetrackSearch');
    this.racetracks = [];
    if (this.currentSearch) {
      return this.racetrackService.query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      });
    }
    return this.racetrackService.query({
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    sessionStorage.removeItem('racetrackSearch');
    this.racetracks = [];
    this.paginator.pageIndex = 0;
    this.currentSearch = '';
    this.isLoadingResults = true;
    this.racetrackService
      .query({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IRacetrack[]>) => {
        this.isLoadingResults = false;
        this.racetracks = this.processRacetracksResponse(data);
      });
  }

  search(query) {
    sessionStorage.setItem('racetrackSearch', query);
    this.racetracks = [];
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.isLoadingResults = true;
    this.racetrackService
      .query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<IRacetrack[]>) => {
        this.isLoadingResults = false;
        this.racetracks = this.processRacetracksResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IRacetrack) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInRacetracks() {
    this.eventSubscriber = this.eventManager.subscribe('racetracksListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<IRacetrack[]>) => (this.racetracks = this.processRacetracksResponse(data)))
    );
  }

  sorting() {
    const result = [this.sort.active + ',' + this.sort.direction];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
}
