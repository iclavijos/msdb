import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TyreProvider } from './tyre-provider.model';
import { TyreProviderService } from './tyre-provider.service';
@Injectable()
export class TyreProviderPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private tyreProviderService: TyreProviderService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.tyreProviderService.find(id).subscribe(tyreProvider => {
                this.tyreProviderModalRef(component, tyreProvider);
            });
        } else {
            return this.tyreProviderModalRef(component, new TyreProvider());
        }
    }

    tyreProviderModalRef(component: Component, tyreProvider: TyreProvider): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.tyreProvider = tyreProvider;
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
