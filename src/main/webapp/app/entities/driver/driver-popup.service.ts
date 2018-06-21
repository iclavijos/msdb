import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Driver } from './driver.model';
import { DriverService } from './driver.service';

@Injectable()
export class DriverPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private driverService: DriverService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.driverService.find(id).subscribe((driver) => {
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
                    this.ngbModalRef = this.driverModalRef(component, driver);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.driverModalRef(component, new Driver());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    driverModalRef(component: Component, driver: Driver): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.driver = driver;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
