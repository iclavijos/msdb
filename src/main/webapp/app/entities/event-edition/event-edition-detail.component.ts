import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { IEventEdition } from 'app/shared/model/event-edition.model';
import { IEventSession } from 'app/shared/model/event-session.model';
import { IEventEntry } from 'app/shared/model/event-entry.model';
import { EventService } from '../event/event.service';
import { EventEditionService } from './event-edition.service';

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
  templateUrl: './event-edition-detail.component.html'
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
  editions: any[];
  navigationIds = null;
  showPoints = false;
  driversBestTimes: any;
  hasLapsData: any;
  lapTimes: any[] = [];
  maxLaps = -1;
  index = 0;

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
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      this.eventEdition = eventEdition;
      // this.loadSessions(id);
      if (eventEdition.seriesId) {
        this.eventEditionService.findPrevNextInSeries(eventEdition.id).subscribe(res => (this.navigationIds = res));
      }
      this.eventEditionService.hasLapsData(eventEdition.id).subscribe(res => (this.hasLapsData = res));
      this.eventService.findEventEditionIds(eventEdition.event.id).subscribe(res => (this.editions = res));
      this.eventEditionService.findDriversBestTimes(eventEdition.id).subscribe(res => {
        this.driversBestTimes = res.slice(1);
        this.bestTimesColumns = res[0];
      });

      if (this.eventEdition.trackLayout.layoutImageUrl) {
        const layout = {
          src: this.eventEdition.trackLayout.layoutImageUrl,
          caption: '',
          thumb: this.eventEdition.trackLayout.layoutImageUrl.replace('/upload', '/upload/c_thumb,w_200,g_face')
        };
        this.posLayout = this.lightboxAlbum.push(layout);
      }

      if (this.eventEdition.posterUrl) {
        const afficheThumb = this.eventEdition.posterUrl.replace('/upload', '/upload/c_thumb,w_200,g_face');
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

  jumpToEdition(id) {
    if (!id) {
      return false;
    }
    this.router.navigate(['/event-edition', id]);
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
          .subscribe(event => {
            //             const diffDays = event.body.eventDate.diff(this.eventEdition.eventDate, 'days');
            //             const clonedSessions = [];
            //             this.eventSessionsComponent.eventSessions.forEach(val => clonedSessions.push(Object.assign({}, val)));
            //             for (const session of clonedSessions) {
            //               session.sessionStartTime = session.sessionStartTime.add(diffDays, 'days');
            //             }
            //             this.eventSessionsComponent.eventSessions = clonedSessions;
            this.eventEdition = event.body;
          });
      }
    });
  }
}
