import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';

import { Observable } from 'rxjs/Rx';
import {map} from 'rxjs/operator/map';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {distinctUntilChanged} from 'rxjs/operator/distinctUntilChanged';
import {_catch} from 'rxjs/operator/catch';
import {_do} from 'rxjs/operator/do';
import {switchMap} from 'rxjs/operator/switchMap';
import {of} from 'rxjs/observable/of';

import { EventEdition } from './event-edition.model';
import { EventEditionPopupService } from './event-edition-popup.service';
import { EventEditionService } from './event-edition.service';

@Component({
    selector: 'jhi-event-edition-copy-entries-dialog',
    templateUrl: './event-edition-copy-entries-dialog.component.html'
})
export class EventEditionCopyEntriesDialogComponent {

    eventEdition: EventEdition;
    selectedEventEdition: EventEdition;
    private eventEditionSearch: string;
    searching = false;
    searchFailed = false;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventEditionService: EventEditionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
    ) {

    }
    
    private innersearch(term: string) {
        if (term === '') {
          return of.call([]);
        }

        return map.call(this.eventEditionService.typeAhead(term),
          response => response.json);
      }
    
    search = (text$: Observable<string>) =>
    _do.call(
      switchMap.call(
        _do.call(
          distinctUntilChanged.call(
            debounceTime.call(text$, 300)),
          () => this.searching = true),
        term =>
          _catch.call(
            _do.call(this.innersearch(term), () => this.searchFailed = false),
            () => {
              this.searchFailed = true;
              return of.call([]);
            }
          )
      ),
      () => this.searching = false);
    
    inputFormatter = (result: any) => result.longEventName;
    
    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmCopy () {
        this.eventEditionService.copyEntries(this.selectedEventEdition.id, this.eventEdition.id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventEntryListModification'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-edition-copy-entries-popup',
    template: ''
})
export class EventEditionCopyEntriesPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventEditionPopupService: EventEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.eventEditionPopupService
                .open(EventEditionCopyEntriesDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
