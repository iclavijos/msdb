import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEventSession } from 'app/shared/model/event-session.model';
import { EventSessionService } from './event-session.service';

@Component({
    selector: 'jhi-event-session-delete-dialog',
    templateUrl: './event-session-delete-dialog.component.html'
})
export class EventSessionDeleteDialogComponent {
    eventSession: IEventSession;

    constructor(
        protected eventSessionService: EventSessionService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.eventSessionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventSessionListModification',
                content: 'Deleted an eventSession'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-session-delete-popup',
    template: ''
})
export class EventSessionDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventSession }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(EventSessionDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.eventSession = eventSession;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/event-session', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/event-session', { outlets: { popup: null } }]);
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
