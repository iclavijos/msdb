import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { EventEdition } from 'app/shared/model/event-edition.model';
import { IEventEntry } from 'app/shared/model/event-entry.model';
import { EventEntryService } from './event-entry.service';

@Component({
  selector: 'jhi-event-entry',
  styleUrls: ['event-entry.component.scss'],
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

  constructor(
    private eventEntryService: EventEntryService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {}

  private getBigFaceUrl(portraitUrl: string) {
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

  private getSmallFaceUrl(portraitUrl: string) {
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
    this.eventEntryService.findEntries(this.eventEdition.id).subscribe(entries => (this.eventEntries = entries.body));
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
