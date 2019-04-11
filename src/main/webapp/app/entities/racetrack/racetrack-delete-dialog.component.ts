import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRacetrack } from 'app/shared/model/racetrack.model';
import { RacetrackService } from './racetrack.service';

@Component({
    selector: 'jhi-racetrack-delete-dialog',
    templateUrl: './racetrack-delete-dialog.component.html'
})
export class RacetrackDeleteDialogComponent {
    racetrack: IRacetrack;

    constructor(
        protected racetrackService: RacetrackService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.racetrackService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'racetrackListModification',
                content: 'Deleted an racetrack'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-racetrack-delete-popup',
    template: ''
})
export class RacetrackDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ racetrack }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(RacetrackDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.racetrack = racetrack;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/racetrack', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/racetrack', { outlets: { popup: null } }]);
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
