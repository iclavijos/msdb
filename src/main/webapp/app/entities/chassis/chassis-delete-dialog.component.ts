import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

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
        private chassisService: ChassisService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.chassisService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private chassisPopupService: ChassisPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.chassisPopupService
                .open(ChassisDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
