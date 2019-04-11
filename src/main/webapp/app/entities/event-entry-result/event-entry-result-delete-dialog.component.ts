import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEventEntryResult } from 'app/shared/model/event-entry-result.model';
import { EventEntryResultService } from './event-entry-result.service';

@Component({
    selector: 'jhi-event-entry-result-delete-dialog',
    templateUrl: './event-entry-result-delete-dialog.component.html'
})
export class EventEntryResultDeleteDialogComponent {
    eventEntryResult: IEventEntryResult;

    constructor(
        protected eventEntryResultService: EventEntryResultService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.eventEntryResultService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventEntryResultListModification',
                content: 'Deleted an eventEntryResult'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-entry-result-delete-popup',
    template: ''
})
export class EventEntryResultDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventEntryResult }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EventEntryResultDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.eventEntryResult = eventEntryResult;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/event-entry-result', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/event-entry-result', { outlets: { popup: null } }]);
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
