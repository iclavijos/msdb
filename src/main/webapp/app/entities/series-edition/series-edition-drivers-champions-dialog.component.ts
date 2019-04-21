import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JhiEventManager, JhiAlertService, JhiLanguageService } from 'ng-jhipster';

import { Category } from '../category';
import { SeriesEdition, SelectedDriverData } from './series-edition.model';
import { SeriesEditionPopupService } from './series-edition-popup.service';
import { SeriesEditionService } from './series-edition.service';

@Component({
    selector: 'jhi-series-edition-drivers-champions-dialog',
    templateUrl: './series-edition-drivers-champions-dialog.component.html'
})
export class SeriesEditionDriversChampionsDialogComponent implements OnInit {
	
	drivers: any;
	seriesEditionId: number;
	seriesEdition: SeriesEdition;
	isSaving: boolean;
	driversUnfiltered: any;
	selectedDrivers: any;
    filteredDrivers: string[] = [];
    filterCategory: Category;
    filterCategoryId: number = null;
    math = Math;
    temp = Array;

	@ViewChildren('myItem') item;
	selectedIds = [];

	constructor(
		public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private seriesEditionService: SeriesEditionService
	) {
	}

	ngOnInit() {
		this.seriesEditionService.find(this.seriesEditionId).subscribe((seriesEdition) => {
            this.seriesEdition = seriesEdition;
            this.seriesEdition.allowedCategories = seriesEdition.allowedCategories.sort((c1, c2) => {
            	if (c1.shortname > c2.shortname) return 1;
            	if (c1.shortname < c2.shortname) return -1;
            	return 0;
            });
        });
        this.seriesEditionService.findDriversStandings(this.seriesEdition.id).subscribe(driversStandings => {
    		this.driversUnfiltered = driversStandings.json();
    		this.driversUnfiltered.map(driver => {
			    const items = driver.driverName.split(' '); 
			    let res = '';
			    for(let i = 0; i < items.length -1; i++) {
			        if (items[i].length == 2) res += items[i] + ' ';
			        else res += items[i].charAt(0) + '. ';
			    }
			    res += items[items.length - 1];
			    driver.driverName = res;
    		});
    		if (this.seriesEdition.standingsPerCategory) {
                this.drivers = this.driversUnfiltered.filter(d => d.category === this.filterCategory);
            } else {
    		    this.drivers = driversStandings.json();
            }
    	});
	}
	
	clear () {
        this.activeModal.dismiss('cancel');
    }
	
	onCheckboxSelect(id, event) {
	    if (event.target.checked === true) {
	    	const selectedDriver = new SelectedDriverData(id, this.filterCategoryId);
	      this.selectedIds.push(selectedDriver);
	    }
	    if (event.target.checked === false) {
	      this.selectedIds = this.selectedIds.filter((item) => item !== id);
	    }
	  }
	  
	changeCategory(event) {
		this.filterCategoryId = this.filterCategory.id;
        this.filteredDrivers = this.driversUnfiltered.filter(d => d.category === this.filterCategory.shortname);
    }
	
	save() {
        this.isSaving = true;
        this.seriesEditionService.setDriversChampions(this.seriesEditionId, this.selectedIds)
        	.subscribe((res: any) => this.onSaveSuccess(), (res: any) => this.onError(res));
    }

    private onSaveSuccess() {
        this.eventManager.broadcast({ name: 'driversChampionsModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss();
    }
    
    private onError(error: any) {
    	this.isSaving = false;
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-series-edition-drivers-champions-popup',
    template: ''
})
export class SeriesEditionDriversChampionsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private seriesEditionPopupService: SeriesEditionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
        	this.seriesEditionPopupService
            	.openDriversChamps(SeriesEditionDriversChampionsDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
