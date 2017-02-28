import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuelProvider } from './fuel-provider.model';
import { FuelProviderService } from './fuel-provider.service';
@Injectable()
export class FuelProviderPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private fuelProviderService: FuelProviderService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.fuelProviderService.find(id).subscribe(fuelProvider => {
                this.fuelProviderModalRef(component, fuelProvider);
            });
        } else {
            return this.fuelProviderModalRef(component, new FuelProvider());
        }
    }

    fuelProviderModalRef(component: Component, fuelProvider: FuelProvider): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.fuelProvider = fuelProvider;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
