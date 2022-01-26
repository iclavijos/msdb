import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SeriesService } from 'app/entities/series/service/series.service';
import { SeriesEditionService } from 'app/entities/series-edition/service/series-edition.service';
import { ISeriesEdition } from 'app/entities/series-edition/series-edition.model';
import { IEventEdition } from 'app/entities/event-edition/event-edition.model';
import { SeriesEditionUpdateComponent } from '../update/series-edition-update.component';
import { SeriesEditionCalendarDialogComponent } from '../calendar/series-edition-calendar-dialog.component';
import { SeriesEditionCalendarRemoveDialogComponent } from '../calendar/series-edition-calendar-remove-dialog.component';
import { SeriesEditionCloneDialogComponent } from '../clone/series-edition-clone-dialog.component';
import { SeriesEditionCalendarSubscriptionDialogComponent } from '../calendar/series-edition-calendar-subscription-dialog.component';

import { ImagesService } from '../../shared/services/images.service';

import { MatDialog } from '@angular/material/dialog';

import { icon, latLng, Marker, tileLayer } from 'leaflet';
import * as L from 'leaflet';

export class NavigationIds {
  prevId: number;
  nextId: number;
  prevName: string;
  nextName: string;
}

export class EventAndWinners {
  eventEdition: IEventEdition;
  racetrackLogoUrl: string;
  racetrackLayoutUrl: string;
  winners: any[];
}

@Component({
  selector: 'jhi-series-edition-detail',
  templateUrl: './series-edition-detail.component.html',
  styleUrls: ['./series-edition-detail.component.scss']
})
export class SeriesEditionDetailComponent implements OnInit {
  seriesEdition: ISeriesEdition | null = null;
  isActive = false;
  genericPosterUrl: string;

  displayedColumns: string[] = ['date', 'name', 'winners', 'buttons'];

  driversStandings: any;
  teamsStandings: any;
  manufacturersStandings: any;
  driversChampions: any[];
  teamsChampions: any[];
  numEvents = 0;
  eventsProcessed = 0;
  displayEvents = false;
  colsChampsDriver = 'col-md-3';
  colsChampsTeam = 'col-md-3';
  previousEditionId: number;
  nextEditionId: number;
  editions = [];
  currentEdPos: number;
  eventsAndWinners: EventAndWinners[];

  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps
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
    protected activatedRoute: ActivatedRoute,
    protected alertService: JhiAlertService,
    protected seriesService: SeriesService,
    protected seriesEditionService: SeriesEditionService,
    protected imagesService: ImagesService,
    private dialog: MatDialog,
    private titleService: Title,
    protected ngZone: NgZone,
    protected elementRef: ElementRef
  ) {
    this.genericPosterUrl = imagesService.getGenericRacePoster();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seriesEdition }) => {
      this.seriesEdition = seriesEdition;
      this.seriesService.findSeriesEditionIds(seriesEdition.series.id).subscribe(res => {
        this.editions = res.sort((e1, e2) => (e1.editionYear > e2.editionYear ? 1 : e1.editionYear < e2.editionYear ? -1 : 0));
        const currentEdPos = this.editions.map(e => e.id as number).indexOf(seriesEdition.id);
        this.previousEditionId = currentEdPos > 0 ? this.editions[currentEdPos - 1].id : null;
        this.nextEditionId = currentEdPos < this.editions.length - 1 ? this.editions[currentEdPos + 1].id : null;
      });
      this.loadSeriesEvents();
    });
  }

  onMapReady(newMap: L.Map): void {
    setTimeout(() => {
      this.map.invalidateSize();
    });
    this.map = newMap;
    if (this.eventsAndWinners.length > 0) {
      this.addMapMarkers();
    }
  }

  loadSeriesEvents(): void {
    this.seriesEditionService.findEvents(this.seriesEdition.id).subscribe(events => {
      this.eventsAndWinners = events.body;
      this.seriesEdition.events = this.eventsAndWinners.map(eventWinners => eventWinners.eventEdition);
      if (this.seriesEdition.events.filter(event => event.status !== 'ONGOING').length > 0) {
        this.displayedColumns.unshift('status');
      }
      this.addMapMarkers();
    });
  }

  previousState(): void {
    window.history.back();
  }

  public getPosterUrl(posterUrl: string): string {
    if (posterUrl) {
      return posterUrl
    };

    return this.genericPosterUrl;
  }

  public getFaceUrl(faceUrl: string, numDrivers: number, thumbSize: number): string {
    return this.imagesService.getFaceUrl(faceUrl, thumbSize, thumbSize);
  }

  public concatDriverNames(drivers: any[]): string {
    return drivers.map(d => d.driverName as string).join(', ');
  }

  editSeriesEdition(): void {
    const dialogRef = this.dialog.open(SeriesEditionUpdateComponent, {
      data: {
        series: this.seriesEdition.series,
        seriesEdition: this.seriesEdition
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  addEventToCalendar(): void {
    const dialogRef = this.dialog.open(SeriesEditionCalendarDialogComponent, {
      data: {
        seriesEdition: this.seriesEdition
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadSeriesEvents();
      }
    });
  }

  editEventAssignment(event): void {
    const dialogRef = this.dialog.open(SeriesEditionCalendarDialogComponent, {
      data: {
        seriesEdition: this.seriesEdition,
        eventEdition: event
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadSeriesEvents();
      }
    });
  }

  removeEventFromSeries(event): void {
    const dialogRef = this.dialog.open(SeriesEditionCalendarRemoveDialogComponent, {
      data: {
        seriesEditionId: this.seriesEdition.id,
        eventEditionId: event.id,
        eventName: event.eventEditionName
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadSeriesEvents();
      }
    });
  }

  cloneSeries(): void {
    this.dialog.open(SeriesEditionCloneDialogComponent, {
      data: {
        seriesEdition: this.seriesEdition
      }
    });
  }

  showCalendarSubscriptionDialog(): void {
    this.dialog.open(SeriesEditionCalendarSubscriptionDialogComponent, {
      data: {
        seriesId: this.seriesEdition.id
      }
    });
  }

  updateStandings(): void {
    this.alertService.info('motorsportsDatabaseApp.series.seriesEdition.updatingStandings', null, null);
    this.seriesEditionService
      .updateStandings(this.seriesEdition.id)
      .subscribe(
        () => this.standingsUpdated(),
        () => this.alertService.error('motorsportsDatabaseApp.series.seriesEdition.standingsNotUpdated', null, null)
      );
  }

  loadDriversStandings(id): void {
    this.seriesEditionService.findDriversStandings(id).subscribe(standings => {
      this.driversStandings = standings.body;
    });
  }

  loadTeamsStandings(id): void {
    this.seriesEditionService.findTeamsStandings(id).subscribe(standings => {
      this.teamsStandings = standings.body;
    });
  }

  standingsUpdated(): void {
    this.alertService.success('motorsportsDatabaseApp.series.seriesEdition.standingsUpdated', null, null);
    this.loadDriversStandings(this.seriesEdition.id);
    this.loadTeamsStandings(this.seriesEdition.id);
  }

  loadDriversChampions(id): void {
    this.seriesEditionService.findDriversChampions(id).subscribe(champions => {
      this.driversChampions = champions.body;
      if (this.driversChampions.length > 0) {
        this.colsChampsDriver = `col-${Math.floor(12 / this.driversChampions.length)}`;
      }
    });
  }

  loadTeamsChampions(id): void {
    this.seriesEditionService.findTeamsChampions(id).subscribe(champions => {
      this.teamsChampions = champions.body;
      if (this.teamsChampions.length > 0) {
        this.colsChampsTeam = `col-${Math.floor(12 / this.teamsChampions.length)}`;
      }
    });
  }

  jumpToEdition(id): void {
    if (!id) {
      return false;
    }
    this.router.navigate(['/series/edition', id, 'view']);
  }

  gotoPrevious(): void {
    this.router.navigate(['/series/edition', this.previousEditionId, 'view']);
  }

  gotoNext(): void {
    this.router.navigate(['/series/edition', this.nextEditionId, 'view']);
  }

  private addMapMarkers(): void {
    const markers = [];
    this.seriesEdition.events.forEach(event => {
      let latitude, longitude, id: number;
      let logoUrl!, locationName!, flag!, trackLayoutUrl!: string;
      let rally = false;

      if (event.event.rally) {
        latitude = event.latitude;
        longitude = event.longitude;
        id = event.id;
        rally = true;
        locationName = event.location;
      } else if (!event.event.rally && !event.event.raid) {
        latitude = event.trackLayout.racetrack.latitude;
        longitude = event.trackLayout.racetrack.longitude;
        id = event.trackLayout.racetrack.id;
        logoUrl = event.trackLayout.racetrack.logoUrl;
        locationName = event.trackLayout.racetrack.name;
        flag = event.trackLayout.racetrack.countryCode;
        trackLayoutUrl = event.trackLayout.layoutImageUrl;
      }
      const location = new Marker([latitude, longitude])
        .setIcon(
          icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png'
          })
        )
        .on('popupopen', $event => {
          const isRally = $event.target.options.isRally;
          if (isRally) {
            this.navigateToEvent($event.target.options.trackId, this.elementRef);
          } else {
            this.navigateToRacetrack($event.target.options.trackId, this.elementRef);
          }
        });
      L.Util.setOptions(location, { trackId: id, isRally: rally });
      const logo: string = logoUrl ? `<img src=${String(logoUrl)} style="max-height: 200px; max-width: 200px"><br/>` : '';
      let popup = `<p align="center">${String(logo)}<h3>${String(event.longEventName)}</h3><br/><h4>${String(locationName)} `;
      if (!rally) {
        popup += `<img src="/images/flags/${String(flag)}.png"/><br/>`;
        popup += `<img src="${trackLayoutUrl}" style="max-height: 200px; max-width: 200px">`;
      }
      popup += `</h4><br/></p>`;

      popup = popup + `<a id="mapLink" href="javascript:void">Details</a>`;
      location.addTo(this.map).bindPopup(popup, { minWidth: 220 });

      markers.push(location);
    });
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      this.map.fitBounds(group.getBounds());
    }
  }

  private navigateToRacetrack(trackId, elementRef: ElementRef): void {
    elementRef.nativeElement.querySelector('#mapLink').addEventListener('click', () => {
      this.ngZone.run(() => {
        this.router.navigate(['/racetrack', trackId, 'view']);
      });
    });
  }

  private navigateToEvent(trackId, elementRef: ElementRef): void {
    elementRef.nativeElement.querySelector('#mapLink').addEventListener('click', () => {
      this.ngZone.run(() => {
        this.router.navigate(['/event/edition', trackId, 'view-ed']);
      });
    });
  }
}
