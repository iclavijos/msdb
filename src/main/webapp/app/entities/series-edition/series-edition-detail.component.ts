import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiEventManager, JhiAlertService, JhiLanguageService } from 'ng-jhipster';
import { Subscription } from 'rxjs/Rx';
import { SeriesEdition } from './series-edition.model';
import { SeriesEditionService } from './series-edition.service';
import { EventEditionService } from '../event-edition/event-edition.service';

@Component({
    selector: 'jhi-series-edition-detail',
    templateUrl: './series-edition-detail.component.html'
})
export class SeriesEditionDetailComponent implements OnInit, OnDestroy {

    seriesEdition: SeriesEdition;
    eventSubscriber: Subscription;
    private subscription: any;
    driversStandings: any;
    teamsStandings: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private seriesEditionService: SeriesEditionService,
        private eventEditionService: EventEditionService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.eventSubscriber = this.eventManager.subscribe('seriesEditionEventsListModification', (response) => this.loadEvents(this.seriesEdition.id));
    }

    load (id) {
        this.seriesEditionService.find(id).subscribe(seriesEdition => {
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
        this.eventManager.destroy(this.eventSubscriber);
    }
    
    private onRemoveError (error) {
        this.alertService.error(error.message, null, null);
    }

}
