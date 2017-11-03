import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import {map} from 'rxjs/operator/map';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {distinctUntilChanged} from 'rxjs/operator/distinctUntilChanged';
import {_catch} from 'rxjs/operator/catch';
import {_do} from 'rxjs/operator/do';
import {switchMap} from 'rxjs/operator/switchMap';
import {of} from 'rxjs/observable/of';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Chassis } from './chassis.model';
import { ChassisPopupService } from './chassis-popup.service';
import { ChassisService } from './chassis.service';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-chassis-dialog',
    templateUrl: './chassis-dialog.component.html'
})
export class ChassisDialogComponent implements OnInit {

    chassis: Chassis;
    authorities: any[];
    isSaving: boolean;
    searching = false;
    searchFailed = false;

    chassisCollection: Chassis[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private chassisService: ChassisService,
        private eventManager: JhiEventManager
    ) {
    }
    
    private innersearch(term: string) {
        if (term === '') {
          return of.call([]);
        }

        return map.call(this.chassisService.searchChassis(term),
          response => response.json);
      }
    
    search = (text$: Observable<string>) =>
    _do.call(
      switchMap.call(
        _do.call(
          distinctUntilChanged.call(
            debounceTime.call(text$, 300)),
          () => this.searching = true),
        term =>
          _catch.call(
            _do.call(this.innersearch(term), () => this.searchFailed = false),
            () => {
              this.searchFailed = true;
              return of.call([]);
            }
          )
      ),
      () => this.searching = false);
    
    inputFormatter = (result: any) => result.manufacturer + ' ' + result.name;

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
        this.chassisService.query()
            .subscribe((res: ResponseWrapper) => { this.chassisCollection = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.chassis.id !== undefined) {
            this.subscribeToSaveResponse(
                this.chassisService.update(this.chassis));
        } else {
            this.subscribeToSaveResponse(
                this.chassisService.create(this.chassis));
        }
    }

    private subscribeToSaveResponse(result: Observable<Chassis>) {
        result.subscribe((res: Chassis) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Chassis) {
        this.eventManager.broadcast({ name: 'chassisListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackChassisById(index: number, item: Chassis) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-chassis-popup',
    template: ''
})
export class ChassisPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private chassisPopupService: ChassisPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.chassisPopupService
                    .open(ChassisDialogComponent as Component, params['id']);
            } else {
                this.chassisPopupService
                    .open(ChassisDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
