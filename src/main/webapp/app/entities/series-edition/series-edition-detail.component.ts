import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService  } from 'ng-jhipster';

import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';
import { EventEditionService } from '../event-edition/event-edition.service';
import { Driver } from '../driver';

@Component({
    selector: 'jhi-series-edition-detail',
    templateUrl: './series-edition-detail.component.html'
})
export class SeriesEditionDetailComponent implements OnInit, OnDestroy {

    seriesEdition: SeriesEdition;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    driversStandings: any;
    teamsStandings: any;
    manufacturersStandings: any;
    driversChampions: any[];

    private numEvents = 0;
    private eventsProcessed = 0;
    private displayEvents = false;
    private colsChamps = 'col-md-3';

    constructor(
        private seriesEditionService: SeriesEditionService,
        private eventEditionService: EventEditionService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSeriesEditions();
    }

    load(id) {
        this.seriesEditionService.find(id).subscribe((seriesEdition) => {
            this.seriesEdition = seriesEdition;
            this.loadEvents(id);
            this.loadDriversChampions(id);
            if (this.seriesEdition.teamsStandings) {
                // this.loadTeamsStandings(id);
            }
            if (this.seriesEdition.manufacturersStandings) {

            }
        });
    }

    loadEvents(id) {
        this.seriesEditionService.findEvents(id).subscribe((events) => {
           const data = events.json();
//           this.numEvents = data.length;
//           this.eventsProcessed = 0;
//           for(let i = 0; i < data.length; i++) {
//               const event = data[i];
//               data[i].winners = new Array();
//               this.eventEditionService.findWinners(event.id).subscribe((winners) => {
//                   data[i].winners.push(winners);
//                   this.eventsProcessed++;
//                   this.displayEvents = (this.eventsProcessed === this.numEvents);
//               });
//           }
           this.seriesEdition.events = data;
        });
    }

    loadDriversStandings(id) {
        this.seriesEditionService.findDriversStandings(id).subscribe((standings) => {
           this.driversStandings = standings.json();
        });
    }

    loadTeamsStandings(id) {
        this.seriesEditionService.findTeamsStandings(id).subscribe((standings) => {
           this.teamsStandings = standings.json();
        });
    }

    loadDriversChampions(id) {
        this.seriesEditionService.findDriversChampions(id).subscribe((champions) => {
            this.driversChampions = champions.json();
            if (this.driversChampions.length > 0) {
                this.colsChamps = 'col-md-' + Math.floor(12 / this.driversChampions.length);
            }
        });
    }

    removeEvent(eventId) {
        for(let i = 0; i < this.seriesEdition.events.length; i++) {
            const event = this.seriesEdition.events[i];
            if (event.id === eventId) {
                this.seriesEdition.events.splice(i, 1);
                this.seriesEditionService.removeEventFromSeries(this.seriesEdition.id, eventId)
                    .subscribe((res: any) => true, (res: any) => this.onRemoveError(res));
                break;
            }
        }
    }

    updateStandings() {
        this.alertService.info('motorsportsDatabaseApp.series.seriesEdition.updatingStandings', null, null);
        this.seriesEditionService.updateStandings(this.seriesEdition.id).subscribe(
                (res: any) => this.standingsUpdated(),
                (res: any) => this.alertService.error('motorsportsDatabaseApp.series.seriesEdition.standingsNotUpdated', null, null));
    }

    standingsUpdated() {
        this.alertService.success('motorsportsDatabaseApp.series.seriesEdition.standingsUpdated', null, null);
        this.loadDriversStandings(this.seriesEdition.id);
        this.loadTeamsStandings(this.seriesEdition.id);
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    private onRemoveError(error) {
        this.alertService.error(error.message, null, null);
    }

    registerChangeInSeriesEditions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'seriesEditionListModification',
            (response) => this.load(this.seriesEdition.id)
        );
        this.eventSubscriber.add(this.eventManager.subscribe(
            'seriesEditionEventsListModification',
            (response) => this.loadEvents(this.seriesEdition.id)));
        this.eventSubscriber.add(this.eventManager.subscribe(
        	'driversChampionsModification',
        	(response) => this.loadDriversChampions(this.seriesEdition.id)));
    }
}
