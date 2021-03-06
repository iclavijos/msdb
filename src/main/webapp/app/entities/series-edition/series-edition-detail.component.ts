import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { JhiAlertService } from 'ng-jhipster';

import { SeriesService } from '../series/series.service';
import { SeriesEditionService } from './series-edition.service';
import { ISeriesEdition } from 'app/shared/model/series-edition.model';
import { SeriesEditionUpdateComponent } from './series-edition-update.component';
import { SeriesEditionCalendarDialogComponent } from './series-edition-calendar-dialog.component';
import { SeriesEditionCalendarRemoveDialogComponent } from './series-edition-calendar-remove-dialog.component';
import { SeriesEditionCloneDialogComponent } from './series-edition-clone-dialog.component';
import { SeriesEditionCalendarSubscriptionDialogComponent } from './series-edition-calendar-subscription-dialog.component';

import { ImagesService } from 'app/shared/services/images.service';

import { MatDialog } from '@angular/material/dialog';

export class NavigationIds {
  prevId: number;
  nextId: number;
  prevName: string;
  nextName: string;
}

@Component({
  selector: 'jhi-series-edition-detail',
  templateUrl: './series-edition-detail.component.html',
  styleUrls: ['series-edition.scss']
})
export class SeriesEditionDetailComponent implements OnInit {
  seriesEdition: ISeriesEdition;
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

  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected alertService: JhiAlertService,
    protected seriesService: SeriesService,
    protected seriesEditionService: SeriesEditionService,
    protected imagesService: ImagesService,
    private dialog: MatDialog,
    private titleService: Title
  ) {
    this.genericPosterUrl = imagesService.getGenericRacePoster();
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ seriesEdition }) => {
      this.seriesEdition = seriesEdition;
      this.titleService.setTitle(seriesEdition.editionName);
      this.seriesService.findSeriesEditionIds(seriesEdition.series.id).subscribe(res => {
        this.editions = res.sort((e1, e2) => (e1.editionYear > e2.editionYear ? 1 : e1.editionYear < e2.editionYear ? -1 : 0));
        const currentEdPos = this.editions.map(e => e.id).indexOf(seriesEdition.id);
        this.previousEditionId = currentEdPos > 0 ? this.editions[currentEdPos - 1].id : null;
        this.nextEditionId = currentEdPos < this.editions.length - 1 ? this.editions[currentEdPos + 1].id : null;
      });
      this.loadSeriesEvents();
    });
  }

  loadSeriesEvents() {
    this.seriesEditionService.findEvents(this.seriesEdition.id).subscribe(events => {
      this.seriesEdition.events = events.body;
      if (events.body.filter(event => event.status !== 'ONGOING').length > 0) {
        this.displayedColumns.unshift('status');
      }
    });
  }

  previousState() {
    window.history.back();
  }

  public getPosterUrl(posterUrl: string): string {
    if (posterUrl) return posterUrl;

    return this.genericPosterUrl;
  }

  public getFaceUrl(faceUrl: string, numDrivers: number, thumbSize: number): string {
    return this.imagesService.getFaceUrl(faceUrl, thumbSize, thumbSize);
  }

  public concatDriverNames(drivers: any[]): string {
    return drivers.map(d => d.driverName).join(', ');
  }

  editSeriesEdition() {
    const dialogRef = this.dialog.open(SeriesEditionUpdateComponent, {
      data: {
        series: this.seriesEdition.series,
        seriesEdition: this.seriesEdition
      }
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  addEventToCalendar() {
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

  editEventAssignment(event) {
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

  removeEventFromSeries(event) {
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

  cloneSeries() {
    this.dialog.open(SeriesEditionCloneDialogComponent, {
      data: {
        seriesEdition: this.seriesEdition
      }
    });
  }

  showCalendarSubscriptionDialog() {
    this.dialog.open(SeriesEditionCalendarSubscriptionDialogComponent, {
      data: {
        seriesId: this.seriesEdition.id
      }
    });
  }

  updateStandings() {
    this.alertService.info('motorsportsDatabaseApp.series.seriesEdition.updatingStandings', null, null);
    this.seriesEditionService
      .updateStandings(this.seriesEdition.id)
      .subscribe(
        () => this.standingsUpdated(),
        () => this.alertService.error('motorsportsDatabaseApp.series.seriesEdition.standingsNotUpdated', null, null)
      );
  }

  loadDriversStandings(id) {
    this.seriesEditionService.findDriversStandings(id).subscribe(standings => {
      this.driversStandings = standings.body;
    });
  }

  loadTeamsStandings(id) {
    this.seriesEditionService.findTeamsStandings(id).subscribe(standings => {
      this.teamsStandings = standings.body;
    });
  }

  standingsUpdated() {
    this.alertService.success('motorsportsDatabaseApp.series.seriesEdition.standingsUpdated', null, null);
    this.loadDriversStandings(this.seriesEdition.id);
    this.loadTeamsStandings(this.seriesEdition.id);
  }

  loadDriversChampions(id) {
    this.seriesEditionService.findDriversChampions(id).subscribe(champions => {
      this.driversChampions = champions.body;
      if (this.driversChampions.length > 0) {
        this.colsChampsDriver = 'col-' + Math.floor(12 / this.driversChampions.length);
      }
    });
  }

  loadTeamsChampions(id) {
    this.seriesEditionService.findTeamsChampions(id).subscribe(champions => {
      this.teamsChampions = champions.body;
      if (this.teamsChampions.length > 0) {
        this.colsChampsTeam = 'col-' + Math.floor(12 / this.teamsChampions.length);
      }
    });
  }

  jumpToEdition(id) {
    if (!id) {
      return false;
    }
    this.router.navigate(['/series/edition', id, 'view']);
  }

  gotoPrevious() {
    this.router.navigate(['/series/edition', this.previousEditionId, 'view']);
  }

  gotoNext() {
    this.router.navigate(['/series/edition', this.nextEditionId, 'view']);
  }
}
