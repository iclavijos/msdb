import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService  } from 'ng-jhipster';
import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';
import { EventEditionService } from '../event-edition/event-edition.service';

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
            this.loadDriversStandings(id);
            this.loadTeamsStandings(id);
        });
    }
    
    loadEvents(id) {
        this.seriesEditionService.findEvents(id).subscribe(events => {
           let data = events.json();
           for(let i = 0; i < data.length; i++) {
               let event = data[i];
               data[i].winners = new Array();
               this.eventEditionService.findWinners(event.id).subscribe(winners => {
                   data[i].winners.push(winners);
               });
           }
           this.seriesEdition.events = data;
        });
    }
    
    loadDriversStandings(id) {
        this.seriesEditionService.findDriversStandings(id).subscribe(standings => {
           this.driversStandings = standings.json(); 
        });
    }
    
    loadTeamsStandings(id) {
        this.seriesEditionService.findTeamsStandings(id).subscribe(standings => {
           this.teamsStandings = standings.json(); 
        });
    }
    
    removeEvent(eventId) {
        for(let i = 0; i < this.seriesEdition.events.length; i++) {
            let event = this.seriesEdition.events[i];
            if (event.id === eventId) {
                this.seriesEdition.events.splice(i, 1);
                this.seriesEditionService.removeEventFromSeries(this.seriesEdition.id, eventId)
                    .subscribe((res: any) => true, (res: any) => this.onRemoveError(res));
                break;
            }
        }
    }
    
    previousState() {
        this.router.navigate(['/series', this.seriesEdition.series.id]);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSeriesEditions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'seriesEditionListModification',
            (response) => this.load(this.seriesEdition.id)
        );
    }
    
    private onRemoveError (error) {
        this.alertService.error(error.message, null, null);
    }
}
