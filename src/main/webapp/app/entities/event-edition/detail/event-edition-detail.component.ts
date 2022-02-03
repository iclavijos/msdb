import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventEdition, EventsSeriesNavigation } from '../event-edition.model';
import { IEventSession } from 'app/entities/event-session/event-session.model';
import { IEventEntry } from 'app/entities/event-entry/event-entry.model';
import { EditionIdYear } from 'app/entities/event/event.model';
import { EventEditionCopyEntriesDialogComponent } from '../copy-entries/event-edition-copy-entries-dialog.component';
import { EventService } from 'app/entities/event/service/event.service';
import { EventEditionService } from '../service/event-edition.service';
import { EventEditionCloneDialogComponent } from '../clone/event-edition-clone-dialog.component';
import { EventEditionRescheduleDialogComponent } from '../reschedule/event-edition-reschedule-dialog.component';

import { DurationType } from 'app/shared/enumerations/durationType.enum';
import { SessionType } from 'app/shared/enumerations/sessionType.enum';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-event-edition-detail',
  templateUrl: './event-edition-detail.component.html',
  styleUrls: ['./event-edition-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventEditionDetailComponent implements OnInit {
  eventEdition: IEventEdition | null = null;
  eventSessions!: IEventSession[];
  eventEntries!: IEventEntry[];
  convertedTime = false;
  sessionTypes = SessionType;
  durationTypes = DurationType;
  filterCategory = '';
  editions: EditionIdYear[] = [];
  navigationIds: EventsSeriesNavigation[] = [];
  showPoints = false;
  driversBestTimes!: any;
  hasLapsData = false;
  lapTimes: any[] = [];
  maxLaps = -1;
  index = 0;

  previousEditionId!: number;
  nextEditionId!: number;

  bestTimesColumns: string[] = [];

  constructor(
    private eventService: EventService,
    private eventEditionService: EventEditionService,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    private router: Router,
    private renderer: Renderer2,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventEdition }) => {
      this.eventEdition = eventEdition;
      if (eventEdition.seriesEditions) {
        this.eventEditionService.findPrevNextInSeries(eventEdition.id)
          .subscribe((res: EventsSeriesNavigation[]) => (this.navigationIds = res));
      }
      this.eventEditionService.hasLapsData(eventEdition.id).subscribe((res: boolean) => this.hasLapsData = res);
      this.eventService.findEventEditionIds(eventEdition.event.id).subscribe((res: EditionIdYear[]) => {
        this.editions = res.sort((e1, e2) => (e1.editionYear! > e2.editionYear! ? 1 : e1.editionYear! < e2.editionYear! ? -1 : 0));
        const currentEdPos = this.editions.map(e => e.id).indexOf(eventEdition.id);
        this.previousEditionId = currentEdPos > 0 ? this.editions[currentEdPos - 1].id! : -1;
        this.nextEditionId = currentEdPos < this.editions.length - 1 ? this.editions[currentEdPos + 1].id! : -1;
      });
      this.eventEditionService.findDriversBestTimes(eventEdition.id).subscribe(res => {
        this.driversBestTimes = res.slice(1);
        this.bestTimesColumns = res[0];
      });

//       this.lightboxAlbum = [];
//       if (this.eventEdition.trackLayout?.layoutImageUrl) {
//         const layout = {
//           src: this.eventEdition.trackLayout.layoutImageUrl,
//           caption: '',
//           thumb: this.eventEdition.trackLayout.layoutImageUrl.replace('/upload', '/upload/c_thumb,w_200')
//         };
//         this.posLayout = this.lightboxAlbum.push(layout);
//       }
//
//       if (this.eventEdition.posterUrl) {
//         const afficheThumb = this.eventEdition.posterUrl.replace('/upload', '/upload/c_thumb,w_200');
//         const affiche = {
//           src: this.eventEdition.posterUrl,
//           caption: '',
//           thumb: afficheThumb
//         };
//         this.posAffiche = this.lightboxAlbum.push(affiche);
//       }
    });
  }

//   openAffiche() {
//     this.lightbox.open(this.lightboxAlbum, this.posAffiche - 1, { centerVertically: true });
//   }
//
//   openLayout() {
//     this.lightbox.open(this.lightboxAlbum, this.posLayout - 1, { centerVertically: true });
//   }

  isRally(): boolean {
    return this.eventEdition!.event!.rally ?? false;
  }

  isRaid(): boolean {
    return this.eventEdition!.event!.raid ?? false;
  }

  zoomIn(elementToZoom: HTMLElement): void {
    this.renderer.setStyle(elementToZoom, 'transform', 'scale(1.1)');
  }

  zoomOut(elementToUnzoom: HTMLElement): void {
    this.renderer.setStyle(elementToUnzoom, 'transform', 'scale(1.0)');
  }

//   closeAffiche() {
//     this.lightbox.close();
//   }

  updateSessions(newSessions: IEventSession[]): void {
    this.eventSessions = newSessions;
  }

  updateEntries(newEntries: IEventEntry[]): void {
    this.eventEntries = newEntries;
  }

  updateShowPoints(showPoints: boolean): void {
    this.showPoints = showPoints;
  }

  jumpToEdition(id: number): void {
    this.router.navigate(['/event/edition', id, 'view-ed']);
  }

  gotoPrevious(): void {
    this.router.navigate(['/event/edition', this.previousEditionId, 'view-ed']);
  }

  gotoNext(): void {
    this.router.navigate(['/event/edition', this.nextEditionId, 'view-ed']);
  }

  previousState(): void {
    window.history.back();
  }

  editEdition(): void {
    this.router.navigate(['/event/edition', this.eventEdition!.id, 'edit-ed'], {
      state: {
        event: JSON.stringify(this.eventEdition!.event!)
      }
    });
  }

  rescheduleEventDialog(): void {
    const modalRef = this.modalService.open(EventEditionRescheduleDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.eventEdition = this.eventEdition;
    // unsubscribe not needed because closed completes on modal close
//     modalRef.closed.subscribe(reason => {
//       if (reason === 'deleted') {
//         this.loadPage();
//       }
//     });
  }

  copyEntries(): void {
    this.dialog.open(EventEditionCopyEntriesDialogComponent, {
      data: {
        targetEvent: this.eventEdition
      }
    });
  }

  cloneEvent(): void {
    this.dialog.open(EventEditionCloneDialogComponent, {
      data: {
        eventEdition: this.eventEdition
      }
    });
  }
}
