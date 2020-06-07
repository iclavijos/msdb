import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { EventEdition } from 'app/shared/model/event-edition.model';
import { IEventEntry, EventEntry } from 'app/shared/model/event-entry.model';
import { EventEntryService } from './event-entry.service';
import { EventEntryUpdateComponent } from './event-entry-update.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-event-entry',
  templateUrl: './event-entry.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class EventEntryComponent implements OnInit, OnDestroy {
  private expandedElement: IEventEntry | null;

  @Input() eventEdition: EventEdition;
  eventEntries: IEventEntry[];
  currentAccount: any;
  eventSubscriber: Subscription;
  // displayedColumns: string[] = ['raceNumber', 'tyres', 'drivers', 'entryName', 'category', 'carImage', 'buttons'];
  displayedColumns: string[] = ['raceNumber', 'tyres', 'drivers', 'buttons'];
  @Output() entries = new EventEmitter<IEventEntry[]>();

  constructor(
    private eventEntryService: EventEntryService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected dialog: MatDialog
  ) {}

  public getBigFaceUrl(portraitUrl: string) {
    if (portraitUrl != null) {
      let url = portraitUrl.replace('upload/', 'upload/w_240,h_240,c_thumb,g_face,r_max/');
      const pos = url.lastIndexOf('.');
      if (pos > -1) {
        url = url.substring(0, pos);
      }
      url += '.png';

      return url;
    }
    return null;
  }

  public getSmallFaceUrl(portraitUrl: string) {
    if (portraitUrl != null) {
      let url = portraitUrl.replace('upload/', 'upload/w_120,h_120,c_thumb,g_face,r_max/');
      const pos = url.lastIndexOf('.');
      if (pos > -1) {
        url = url.substring(0, pos);
      }
      url += '.png';

      return url;
    }
    return null;
  }

  loadAll() {
    this.eventEntryService.findEntries(this.eventEdition.id).subscribe(entries => {
      this.eventEntries = entries.body;
      this.entries.emit(entries.body);
    });
  }

  addEntry() {
    const dialogRef = this.dialog.open(EventEntryUpdateComponent, {
      data: {
        eventEntry: new EventEntry(),
        eventEdition: this.eventEdition
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  editEntry(entry: IEventEntry) {
    const dialogRef = this.dialog.open(EventEntryUpdateComponent, {
      data: {
        eventEntry: entry,
        eventEdition: this.eventEdition
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInEventEntries();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInEventEntries() {
    this.eventSubscriber = this.eventManager.subscribe('eventEntryListModification', () => this.loadAll());
  }
}
