import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { IEventEdition } from 'app/shared/model/event-edition.model';
import { IEventSession } from 'app/shared/model/event-session.model';
import { EventService } from '../event/event.service';
import { EventEditionService } from './event-edition.service';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'jhi-event-edition-detail',
  templateUrl: './event-edition-detail.component.html'
})
export class EventEditionDetailComponent implements OnInit {
  eventEdition: IEventEdition;
  eventSessions: IEventSession[];
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
  lapNumbers: number[];

  keysSession: any[];
  keysDuration: any[];

  bestTimesColumns: string[];

  private lightboxAlbum: any[] = [];

  constructor(
    private eventService: EventService,
    private eventEditionService: EventEditionService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private lightbox: Lightbox,
    private renderer: Renderer2
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

      this.lapNumbers = Array.from(Array(58), (x, i) => i);

      const afficheThumb = this.eventEdition.posterUrl
        ? this.eventEdition.posterUrl.replace('/upload', '/upload/c_thumb,w_200,g_face')
        : '';
      const affiche = {
        src: this.eventEdition.posterUrl,
        caption: '',
        thumb: afficheThumb
      };
      const layout = {
        src: this.eventEdition.trackLayout.layoutImageUrl,
        caption: '',
        thumb: this.eventEdition.trackLayout.layoutImageUrl
      };
      this.lightboxAlbum.push(affiche);
      this.lightboxAlbum.push(layout);
    });
  }

  openAffiche() {
    this.lightbox.open(this.lightboxAlbum, 0, { centerVertically: true });
  }

  openLayout() {
    this.lightbox.open(this.lightboxAlbum, 1, { centerVertically: true });
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

  jumpToEdition(id) {
    if (!id) {
      return false;
    }
    this.router.navigate(['/event-edition', id]);
  }

  previousState() {
    window.history.back();
  }
}
