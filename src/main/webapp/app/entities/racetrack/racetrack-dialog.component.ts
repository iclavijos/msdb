import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
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
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Racetrack } from './racetrack.model';
import { RacetrackPopupService } from './racetrack-popup.service';
import { RacetrackService } from './racetrack.service';
import { RacetrackLayout, RacetrackLayoutService } from '../racetrack-layout';
import { DriverService } from '../driver'; //TODO: Move country searching to its own service

@Component({
    selector: 'jhi-racetrack-dialog',
    templateUrl: './racetrack-dialog.component.html'
})
export class RacetrackDialogComponent implements OnInit {

    racetrack: Racetrack;
    authorities: any[];
    isSaving: boolean;
    country: any;
    searching = false;
    searchFailed = false;

    racetracklayouts: RacetrackLayout[];
    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private racetrackService: RacetrackService,
        private racetrackLayoutService: RacetrackLayoutService,
        private driverService: DriverService,
        private elementRef: ElementRef,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.racetrack, this.elementRef, field, fieldContentType, idInput);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.racetrack.countryCode = this.country.countryCode;
        if (this.racetrack.id !== undefined) {
            this.subscribeToSaveResponse(
                this.racetrackService.update(this.racetrack));
        } else {
            this.subscribeToSaveResponse(
                this.racetrackService.create(this.racetrack));
        }
    }

    private subscribeToSaveResponse(result: Observable<Racetrack>) {
        result.subscribe((res: Racetrack) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Racetrack) {
        this.eventManager.broadcast({ name: 'racetrackListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackRacetrackLayoutById(index: number, item: RacetrackLayout) {
        return item.id;
    }
    
    private innersearch(term: string) {
        if (term === '') {
          return of.call([]);
        }

        return map.call(this.driverService.searchCountries(term),
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
    
    inputFormatter = (result: any) => result.countryName;

}

@Component({
    selector: 'jhi-racetrack-popup',
    template: ''
})
export class RacetrackPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private racetrackPopupService: RacetrackPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.racetrackPopupService
                    .open(RacetrackDialogComponent as Component, params['id']);
            } else {
                this.racetrackPopupService
                    .open(RacetrackDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
