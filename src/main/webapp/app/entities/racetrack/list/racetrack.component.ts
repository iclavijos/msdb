import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IRacetrack, Racetrack } from '../racetrack.model';
import { RacetrackService } from '../service/racetrack.service';
import { RacetrackDeleteDialogComponent } from '../delete/racetrack-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { AccountService } from 'app/core/auth/account.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';

import { latLng, Marker, tileLayer } from 'leaflet';
import * as L from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'jhi-racetrack',
  templateUrl: './racetrack.component.html',
  styleUrls: ['./racetrack.component.scss']
})
export class RacetrackComponent implements OnInit, AfterViewInit {
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 0;
  predicate = 'name';
  ascending = true;
  reloadData = true;
  selectedTabIndex: number;

  dataSource = new MatTableDataSource<IRacetrack>([]);
  displayedColumns: string[] = ['name', 'location', 'logo']; // , 'buttons'];

  racetracksSearchTextChanged = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;

  map!: L.Map;

  mapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        detectRetina: true,
      })
    ],
    zoom: 2,
    center: latLng([ 0, 0 ]),
    maxBounds: L.latLngBounds(latLng(-90, -180), latLng(90, 180)),
    worldCopyJump: true,
  }

  racetracksMarkers: Marker[] = [];

  constructor(
    protected racetrackService: RacetrackService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal,
    protected sessionStorageService: SessionStorageService,
    protected accountService: AccountService,
    protected ngZone: NgZone,
    protected elementRef: ElementRef,
    protected translateService: TranslateService
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
    this.selectedTabIndex = this.sessionStorageService.retrieve('racetracksSelectedTab') ?? 0;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.accountService.hasAnyAuthority(["ROLE_ADMIN", "ROLE_EDITOR"])) {
      this.displayedColumns.push('buttons');
    }
  }

  onMapReady(event: any): void {
    this.map = event as L.Map;
    setTimeout(() => {
      this.map.invalidateSize();
    });
    this.addMapMarkers();
    this.searchMap(this.currentSearch, false);
  }

  ngOnInit(): void {
    this.currentSearch = this.sessionStorageService.retrieve('racetrackSearch') ?? '';
    this.page = this.sessionStorageService.retrieve('racetrackSearchPage') ?? 0;
    this.itemsPerPage = this.sessionStorageService.retrieve('racetrackSearchItems') ?? ITEMS_PER_PAGE;
    this.predicate = this.sessionStorageService.retrieve('racetrackSearchPredicate') ?? 'name';
    this.ascending = this.sessionStorageService.retrieve('racetrackSearchAscending') ?? true;

    this.loadPage();

    this.racetracksSearchTextChanged
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.page = 0;
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.predicate = 'name';
        this.ascending = true;
        this.loadPage();
      });
  }

  onTabChange(selectedTabIndex: number): void {
    this.sessionStorageService.store('racetracksSelectedTab', selectedTabIndex);
    this.selectedTabIndex = selectedTabIndex;
    if (selectedTabIndex === 0) {
      this.map.fire('resize', {
              			oldSize: {x: 1000, y: 1000},
              			newSize: {x: 100, y: 100}
              		});
    }
  }

  search(query: string): void {
    this.sessionStorageService.store('racetrackSearch', query);
    if (query.length === 0) {
      this.currentSearch = '';
      this.page = 0;
      this.itemsPerPage = ITEMS_PER_PAGE;
      this.predicate = 'name';
      this.ascending = true;
      this.loadPage();
    } else {
      if (query.length >= 3) {
        this.searchMap(query, false);
        this.racetracksSearchTextChanged.next();
      }
    }
  }

  searchMap(query: string, extendSearch = true): void {
    if (!query || query.length < 3) {
      return;
    }
    this.racetracksMarkers.forEach(marker => {
      const lcQuery = query.toLowerCase();
      this.map.removeLayer(marker);
      const markerOptions = marker.options as any;
      if (markerOptions.trackName.toLowerCase().includes(lcQuery) ||
          markerOptions.trackLocation.toLowerCase().includes(lcQuery)) {
        marker.addTo(this.map);
      }
    });
    if (extendSearch) {
      this.search(query);
    }
  }

  clearSearch(): void {
    this.sessionStorageService.clear('racetrackSearchPage');
    this.sessionStorageService.clear('racetrackSearchItems');
    this.sessionStorageService.clear('racetrackSearchPredicate');
    this.sessionStorageService.clear('racetrackSearchAscending');
    this.search('');
  }

  clearSearchMap(): void {
    this.clearSearch();
    this.racetracksMarkers.forEach(marker => {
      this.map.removeLayer(marker);
      marker.addTo(this.map);
    });
  }

  trackId(index: number, item: IRacetrack): number {
    return item.id!;
  }

  delete(event: MouseEvent, racetrack: IRacetrack): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(RacetrackDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.racetrack = racetrack;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  pageChanged(event: PageEvent): void {
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.sessionStorageService.store('racetrackSearchPage', this.page);
    this.sessionStorageService.store('racetrackSearchItems', this.itemsPerPage);
    this.loadPage();
  }

  sortChanged(event: Sort): void {
    this.predicate = event.active;
    this.ascending = (event.direction as string) === 'asc';
    this.sessionStorageService.store('racetrackSearchPredicate', this.predicate);
    this.sessionStorageService.store('racetrackSearchAscending', this.ascending);
    this.loadPage();
    if (this.reloadData) {
      this.page = 0;
      this.sessionStorageService.store('racetrackSearchPage', this.page);
      this.paginator.pageIndex = 0;
    }
  }

  protected loadPage(): void {
    if (!this.reloadData) {
      return;
    }

    this.isLoading = true;
    this.racetrackService
      .query({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IRacetrack[]>) => {
          this.isLoading = false;
          this.totalItems = Number(res.headers.get('X-Total-Count'));
          this.dataSource = new MatTableDataSource(this.instantiateResponseObjects(res.body as IRacetrack[]));
          this.sorter.active = this.predicate;
          this.sorter.start = this.ascending ? 'asc' : 'desc';
          this.dataSource.sort = this.sorter;
          this.paginator.pageIndex = this.page;
          this.setSort(this.predicate, this.ascending ? 'asc' : 'desc');
        },
        () => {
          this.isLoading = false;
          // this.onError();
        }
      );
  }

  protected sort(): string[] {
    const sortPredicates = [`${this.predicate},${this.ascending ? ASC : DESC }`];
    if (this.predicate !== 'id') {
      sortPredicates.push(`id,${ASC}`);
    }
    return sortPredicates;
  }

  private addMapMarkers(): void {
    this.racetracksMarkers = [];
    this.racetrackService
      .query({
        page: 0,
        size: 500
      })
      .subscribe(data =>
        data.body!.forEach(rt => {
          const racetrackMarker = new Marker([rt.latitude!, rt.longitude!])
            .on('popupopen', $event => {
              this.navigateFromPopup($event.target.options.trackId, this.elementRef);
            });
          L.Util.setOptions(racetrackMarker, { trackId: rt.id, trackName: rt.name, trackLocation: rt.location });
          const logo = rt.logoUrl ? `<img src=${rt.logoUrl} style="max-height: 200px; max-width: 200px"><br/>` : '';
          let popup = `<p align="center">${logo}<h4>${rt.name}</h4><br/>${rt.location}, ${rt.country!.countryCode}<br/></p>`;
          popup = popup + `<a id="mapLink" href="javascript:void">${this.translateService.instant('motorsportsDatabaseApp.racetrack.home.link') as string}</a>`;
          racetrackMarker.addTo(this.map).bindPopup(popup, { minWidth: 220 });
          this.racetracksMarkers.push(racetrackMarker);
        })
      );
  }

  private navigateFromPopup(trackId: number, elementRef: ElementRef): void {
    elementRef.nativeElement.querySelector('#mapLink').addEventListener('click', () => {
      this.ngZone.run(() => {
        this.router.navigate(['/racetrack', trackId, 'view']);
      });
    });
  }

  private instantiateResponseObjects(data: IRacetrack[]): IRacetrack[] {
    const objects: IRacetrack[] = [];
    data.forEach(racetrack => objects.push(
      new Racetrack(
        racetrack.id,
        racetrack.name,
        racetrack.location,
        racetrack.country,
        racetrack.timeZone,
        racetrack.latitude,
        racetrack.longitude,
        racetrack.logoContentType,
        racetrack.logo,
        racetrack.logoUrl,
        racetrack.layouts
      )));

    return objects;
  }

  private setSort(id: string, start?: 'asc' | 'desc'): void {
    start = start ?? 'asc';
    const matSort = this.dataSource.sort;
    const toState = 'active';
    const disableClear = false;

    // reset state so that start is the first sort direction that you will see
    this.reloadData = false;
    matSort!.sort({ id: '', start, disableClear });
    matSort!.sort({ id, start, disableClear });
    this.reloadData = true;

    // ugly hack
    (matSort!.sortables.get(id) as MatSortHeader)._setAnimationTransitionState({ toState });
  }
}
