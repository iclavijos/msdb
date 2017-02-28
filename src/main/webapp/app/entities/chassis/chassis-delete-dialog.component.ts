import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Chassis } from './chassis.model';
import { ChassisPopupService } from './chassis-popup.service';
import { ChassisService } from './chassis.service';

@Component({
    selector: 'jhi-chassis-delete-dialog',
    templateUrl: './chassis-delete-dialog.component.html'
})
export class ChassisDeleteDialogComponent {

    chassis: Chassis;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private chassisService: ChassisService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['chassis']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.chassisService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'chassisListModification',
                content: 'Deleted an chassis'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-chassis-delete-popup',
    template: ''
})
export class ChassisDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private chassisPopupService: ChassisPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.chassisPopupService
                .open(ChassisDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
