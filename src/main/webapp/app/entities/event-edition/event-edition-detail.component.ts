import { Title } from '@angular/platform-browser';
import { Component, OnInit, Renderer2, Inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { IEventEdition } from 'app/shared/model/event-edition.model';
import { IEventSession } from 'app/shared/model/event-session.model';
import { IEventEntry } from 'app/shared/model/event-entry.model';
import { EventEditionCopyEntriesDialogComponent } from './event-edition-copy-entries-dialog.component';
import { EventService } from '../event/event.service';
import { EventEditionService } from './event-edition.service';
import { EventEditionCloneDialogComponent } from './event-edition-clone-dialog.component';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Lightbox } from 'ngx-lightbox';

import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'jhi-reschedule-dialog',
  templateUrl: 'reschedule-dialog.component.html'
})
export class RescheduleDialogComponent {
  startDate = new Date();
  newDate: Moment;

  constructor(public dialogRef: MatDialogRef<RescheduleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirmReschedule(): void {
    this.dialogRef.close(this.newDate);
  }
}

@Component({
  selector: 'jhi-event-edition-detail',
  templateUrl: './event-edition-detail.component.html',
  styleUrls: ['event-edition.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventEditionDetailComponent implements OnInit {
  eventEdition: IEventEdition;
  eventSessions: IEventSession[];
  eventEntries: IEventEntry[];
  convertedTime = false;
  private subscription: Subscription;
  private eventSubscriber: Subscription;
  sessionTypes = SessionType;
  durationTypes = DurationType;
  filterCategory: string;
  editions = [];
  navigationIds = null;
  showPoints = false;
  driversBestTimes: any;
  hasLapsData: any;
  lapTimes: any[] = [];
  maxLaps = -1;
  index = 0;

  previousEditionId: number;
  nextEditionId: number;

  posAffiche: number;
  posLayout: number;

  keysSession: any[];
  keysDuration: any[];

  bestTimesColumns: string[];

  public lightboxAlbum: any[] = [];

  constructor(
    private eventService: EventService,
    private eventEditionService: EventEditionService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private lightbox: Lightbox,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      this.eventEdition = eventEdition;
      this.titleService.setTitle(eventEdition.longEventName);
      if (eventEdition.seriesEditions) {
        this.eventEditionService.findPrevNextInSeries(eventEdition.id).subscribe(res => (this.navigationIds = res));
      }
      this.eventEditionService.hasLapsData(eventEdition.id).subscribe(res => (this.hasLapsData = res));
      this.eventService.findEventEditionIds(eventEdition.event.id).subscribe(res => {
        this.editions = res.sort((e1, e2) => (e1.editionYear > e2.editionYear ? 1 : e1.editionYear < e2.editionYear ? -1 : 0));
        const currentEdPos = this.editions.map(e => e.id).indexOf(eventEdition.id);
        this.previousEditionId = currentEdPos > 0 ? this.editions[currentEdPos - 1].id : -1;
        this.nextEditionId = currentEdPos < this.editions.length - 1 ? this.editions[currentEdPos + 1].id : -1;
      });
      this.eventEditionService.findDriversBestTimes(eventEdition.id).subscribe(res => {
        this.driversBestTimes = res.slice(1);
        this.bestTimesColumns = res[0];
      });

      this.lightboxAlbum = [];
      if (this.eventEdition.trackLayout.layoutImageUrl) {
        const layout = {
          src: this.eventEdition.trackLayout.layoutImageUrl,
          caption: '',
          thumb: this.eventEdition.trackLayout.layoutImageUrl.replace('/upload', '/upload/c_thumb,w_200')
        };
        this.posLayout = this.lightboxAlbum.push(layout);
      }

      if (this.eventEdition.posterUrl) {
        const afficheThumb = this.eventEdition.posterUrl.replace('/upload', '/upload/c_thumb,w_200');
        const affiche = {
          src: this.eventEdition.posterUrl,
          caption: '',
          thumb: afficheThumb
        };
        this.posAffiche = this.lightboxAlbum.push(affiche);
      }
    });
  }

  openAffiche() {
    this.lightbox.open(this.lightboxAlbum, this.posAffiche - 1, { centerVertically: true });
  }

  openLayout() {
    this.lightbox.open(this.lightboxAlbum, this.posLayout - 1, { centerVertically: true });
  }

  zoomIn(elementToZoom: HTMLElement) {
    this.renderer.setStyle(elementToZoom, 'transform', 'scale(1.1)');
  }

  zoomOut(elementToUnzoom: HTMLElement) {
    this.renderer.setStyle(elementToUnzoom, 'transform', 'scale(1.0)');
  }

  closeAffiche() {
    this.lightbox.close();
  }

  updateSessions(newSessions) {
    this.eventSessions = newSessions;
  }

  updateEntries(newEntries) {
    this.eventEntries = newEntries;
  }

  updateShowPoints(showPoints) {
    this.showPoints = showPoints;
  }

  jumpToEdition(id) {
    if (!id) {
      return false;
    }
    this.router.navigate(['/event/edition', id, 'view-ed']);
  }

  gotoPrevious() {
    this.router.navigate(['/event/edition', this.previousEditionId, 'view-ed']);
  }

  gotoNext() {
    this.router.navigate(['/event/edition', this.nextEditionId, 'view-ed']);
  }

  previousState() {
    window.history.back();
  }

  rescheduleEventDialog() {
    const dialogRef = this.dialog.open(RescheduleDialogComponent, {
      data: {
        eventEdition: this.eventEdition
      }
    });

    dialogRef.afterClosed().subscribe(newDate => {
      if (newDate) {
        this.eventEditionService
          .rescheduleEvent(this.eventEdition.id, moment.tz(newDate, this.eventEdition.trackLayout.racetrack.timeZone))
          .subscribe(event => (this.eventEdition = event.body));
      }
    });
  }

  copyEntries() {
    this.dialog.open(EventEditionCopyEntriesDialogComponent, {
      data: {
        targetEvent: this.eventEdition
      }
    });
  }

  cloneEvent() {
    this.dialog.open(EventEditionCloneDialogComponent, {
      data: {
        eventEdition: this.eventEdition
      }
    });
  }
}
