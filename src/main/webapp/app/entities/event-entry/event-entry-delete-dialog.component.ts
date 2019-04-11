import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEventEntry } from 'app/shared/model/event-entry.model';
import { EventEntryService } from './event-entry.service';

@Component({
    selector: 'jhi-event-entry-delete-dialog',
    templateUrl: './event-entry-delete-dialog.component.html'
})
export class EventEntryDeleteDialogComponent {
    eventEntry: IEventEntry;

    constructor(
        protected eventEntryService: EventEntryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.eventEntryService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventEntryListModification',
                content: 'Deleted an eventEntry'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-entry-delete-popup',
    template: ''
})
export class EventEntryDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventEntry }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EventEntryDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.eventEntry = eventEntry;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/event-entry', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/event-entry', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
