import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Observable } from 'rxjs/Rx';
import {map} from 'rxjs/operator/map';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {distinctUntilChanged} from 'rxjs/operator/distinctUntilChanged';
import {_catch} from 'rxjs/operator/catch';
import {_do} from 'rxjs/operator/do';
import {switchMap} from 'rxjs/operator/switchMap';
import {of} from 'rxjs/observable/of';

import { EventEdition, EventEditionService } from '../event-edition';
import { EventEntry } from './event-entry.model';
import { EventEntryPopupService } from './event-entry-popup.service';
import { EventEntryService } from './event-entry.service';
import { Driver, DriverService } from '../driver';
import { TeamService } from '../team';
import { ChassisService } from '../chassis';
import { EngineService } from '../engine';
import { TyreProviderService } from '../tyre-provider';
import { FuelProviderService } from '../fuel-provider';
import { Category } from '../category';

@Component({
    selector: 'jhi-event-entry-dialog',
    templateUrl: './event-entry-dialog.component.html'
})
export class EventEntryDialogComponent implements OnInit {

    eventEntry: EventEntry;
    authorities: any[];
    isSaving: boolean;
    searching = false;
    searchFailed = false;
    singleDriver: Driver;

    allowedCategories: Category[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private eventEditionService: EventEditionService,
        private eventEntryService: EventEntryService,
        private driverService: DriverService,
        private teamService: TeamService,
        private chassisService: ChassisService,
        private engineService: EngineService,
        private tyresProviderService: TyreProviderService,
        private fuelProviderService: FuelProviderService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_EDITOR', 'ROLE_ADMIN'];
        if (!this.eventEntry.id) {
            this.eventEditionService.find(this.eventEntry.eventEdition.id).subscribe(eventEdition => {
                this.eventEntry.eventEdition = eventEdition;
                this.allowedCategories = this.eventEntry.eventEdition.allowedCategories;
                if (this.allowedCategories.length === 1) {
                    this.eventEntry.category = this.allowedCategories[0];
                }
                
            });
        } else {
            this.allowedCategories = this.eventEntry.eventEdition.allowedCategories;
            if (!this.eventEntry.eventEdition.multidriver) {
                this.singleDriver = this.eventEntry.drivers[0];
            }
        }
    }
    
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData($event, eventEntry, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                eventEntry[field] = base64Data;
                eventEntry[`${field}ContentType`] = $file.type;
            });
        }
    }
    
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (!this.eventEntry.eventEdition.multidriver) {
            this.eventEntry.drivers = [this.singleDriver];
        }
        if (this.eventEntry.id !== undefined) {
            this.eventEntryService.update(this.eventEntry)
                .subscribe((res: EventEntry) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.eventEntryService.create(this.eventEntry)
                .subscribe((res: EventEntry) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: EventEntry) {
        this.eventManager.broadcast({ name: 'eventEntryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
    
    private innerDriverSearch(term: string) {
        if (term === '') {
            return of.call([]);
        }

        return map.call(this.driverService.typeahead(term), response => response.json);
    }
    
    searchDriver = (text$: Observable<string>) => _do.call(
      switchMap.call(
        _do.call(distinctUntilChanged.call(debounceTime.call(text$, 300)), () => this.searching = true),
        term => _catch.call(
            _do.call(this.innerDriverSearch(term), () => this.searchFailed = false),
            () => {
              this.searchFailed = true;
              return of.call([]);
            }
          )
      ),
      () => this.searching = false);
    
    inputDriverFormatter = (result: any) => result.fullName;
    
    private innerTeamSearch(term: string) {
        if (term === '') {
            return of.call([]);
        }

        return map.call(this.teamService.typeahead(term), response => response.json);
    }
    
    searchTeam = (text$: Observable<string>) => _do.call(
      switchMap.call(
        _do.call(distinctUntilChanged.call(debounceTime.call(text$, 300)), () => this.searching = true),
        term => _catch.call(
            _do.call(this.innerTeamSearch(term), () => this.searchFailed = false),
            () => {
              this.searchFailed = true;
              return of.call([]);
            }
          )
      ),
      () => this.searching = false);
    
    inputTeamFormatter = (result: any) => result.name;
    
    private innerChassisSearch(term: string) {
        if (term === '') {
          return of.call([]);
        }

        return map.call(this.chassisService.searchChassis(term),
          response => response.json);
      }
    
    searchChassis = (text$: Observable<string>) => _do.call(
        switchMap.call(
          _do.call(distinctUntilChanged.call(debounceTime.call(text$, 300)), () => this.searching = true),
          term => _catch.call(
              _do.call(this.innerChassisSearch(term), () => this.searchFailed = false),
              () => {
                this.searchFailed = true;
                return of.call([]);
              }
            )
        ),
        () => this.searching = false);
    
    inputChassisFormatter = (result: any) => result.manufacturer + ' ' + result.name;
    
    private innerEngineSearch(term: string) {
        if (term === '') {
          return of.call([]);
        }

        return map.call(this.engineService.typeahead(term),
          response => response.json);
      }
    
    searchEngine = (text$: Observable<string>) => _do.call(
        switchMap.call(
          _do.call(distinctUntilChanged.call(debounceTime.call(text$, 300)), () => this.searching = true),
          term => _catch.call(
              _do.call(this.innerEngineSearch(term), () => this.searchFailed = false),
              () => {
                this.searchFailed = true;
                return of.call([]);
              }
            )
        ),
        () => this.searching = false);
    
    inputEngineFormatter = (result: any) => result.manufacturer + ' ' + result.name;
    
    private innerTyresSearch(term: string) {
        if (term === '') {
          return of.call([]);
        }

        return map.call(this.tyresProviderService.typeahead(term),
          response => response.json);
      }
    
    searchTyres = (text$: Observable<string>) => _do.call(
        switchMap.call(
          _do.call(distinctUntilChanged.call(debounceTime.call(text$, 300)), () => this.searching = true),
          term => _catch.call(
              _do.call(this.innerTyresSearch(term), () => this.searchFailed = false),
              () => {
                this.searchFailed = true;
                return of.call([]);
              }
            )
        ),
        () => this.searching = false);
    
    inputTyresFormatter = (result: any) => result.name;
    
    private innerFuelSearch(term: string) {
        if (term === '') {
          return of.call([]);
        }

        return map.call(this.fuelProviderService.typeahead(term),
          response => response.json);
      }
    
    searchFuel = (text$: Observable<string>) => _do.call(
        switchMap.call(
          _do.call(distinctUntilChanged.call(debounceTime.call(text$, 300)), () => this.searching = true),
          term => _catch.call(
              _do.call(this.innerFuelSearch(term), () => this.searchFailed = false),
              () => {
                this.searchFailed = true;
                return of.call([]);
              }
            )
        ),
        () => this.searching = false);
    
    inputFuelFormatter = (result: any) => result.name;
    
    private onDriverSelected(evt: NgbTypeaheadSelectItemEvent, self) {
        evt.preventDefault();
        self.value = evt.item.fullName;
        if (!this.eventEntry.eventEdition.multidriver) {
            this.eventEntry.drivers = [evt.item];
        } else {
            if (!this.eventEntry.drivers) {
                this.eventEntry.drivers = new Array();
            }
            this.eventEntry.drivers.push(evt.item);
        }    
    }
    
    private removeDriver(event) {
        let selectedDriverId = event.target.value;
        let i : number = 0;
        for(let driver of this.eventEntry.drivers) {
            if (driver.id == selectedDriverId) {
                this.eventEntry.drivers.splice(i, 1);
            }
            i++;
        }
    }
    
    trackCategoryById(index: number, item: Category) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-event-entry-popup',
    template: ''
})
export class EventEntryPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;


    constructor (
        private route: ActivatedRoute,
        private eventEntryPopupService: EventEntryPopupService
    ) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            let idEdition = params['idEdition'];
            if ( params['id'] ) {
                this.modalRef = this.eventEntryPopupService
                    .open(EventEntryDialogComponent, idEdition, params['id']);
            } else {
                this.modalRef = this.eventEntryPopupService
                    .open(EventEntryDialogComponent, idEdition);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
