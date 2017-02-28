import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Driver } from './driver.model';
import { DriverPopupService } from './driver-popup.service';
import { DriverService } from './driver.service';

@Component({
    selector: 'jhi-driver-delete-dialog',
    templateUrl: './driver-delete-dialog.component.html'
})
export class DriverDeleteDialogComponent {

    driver: Driver;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private driverService: DriverService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['driver']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.driverService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'driverListModification',
                content: 'Deleted an driver'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-driver-delete-popup',
    template: ''
})
export class DriverDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private driverPopupService: DriverPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.driverPopupService
                .open(DriverDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
