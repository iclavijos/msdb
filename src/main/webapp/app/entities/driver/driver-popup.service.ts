import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Driver } from './driver.model';
import { DriverService } from './driver.service';
@Injectable()
export class DriverPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private driverService: DriverService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.driverService.find(id).subscribe(driver => {
                if (driver.birthDate) {
                    driver.birthDate = {
                        year: driver.birthDate.getFullYear(),
                        month: driver.birthDate.getMonth() + 1,
                        day: driver.birthDate.getDate()
                    };
                }
                if (driver.deathDate) {
                    driver.deathDate = {
                        year: driver.deathDate.getFullYear(),
                        month: driver.deathDate.getMonth() + 1,
                        day: driver.deathDate.getDate()
                    };
                }
                this.driverModalRef(component, driver);
            });
        } else {
            return this.driverModalRef(component, new Driver());
        }
    }

    driverModalRef(component: Component, driver: Driver): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.driver = driver;
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
