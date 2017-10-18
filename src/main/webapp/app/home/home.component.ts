import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { ActivatedRoute, Router } from '@angular/router';

import { Http, Response } from '@angular/http';

import { Account, LoginModalService, Principal } from '../shared';

import { HomeData } from './home.model';

import * as moment from 'moment-timezone';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ]

})
export class HomeComponent implements OnInit {

    account: Account;
    modalRef: NgbModalRef;
    homeData: HomeData = new HomeData(); //Not a nice solution. Should find out what to use (Promise? Observable? ???)
    searchEntriesStr: string;
    searchEventsStr: string;
    calendar: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private principal: Principal,
        private http: Http,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.http.get('api/home').subscribe((res: Response) => {
            this.homeData = res.json();
        });
        this.http.get('api/home/calendar').subscribe((res: Response) => {
            const currentTZ = moment.tz.guess();
            const data = res.json();
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].sessions.length; j++) {
                    const session = data[i].sessions[j];
                    session.sessionStartTime = moment(session.sessionStartTime * 1000).tz(currentTZ);
                    session.sessionEndTime = moment(session.sessionEndTime * 1000).tz(currentTZ);
                }
            }
            this.calendar = data;
        });
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
    
    searchEntries(query) {
        if (!query) {
            return this.clearEntries();
        }
        this.router.navigate(['/homeEntries', { search: this.searchEntriesStr }]);
    }
    
    searchEvents(query) {
        if (!query) {
            return this.clearEvents();
        }
        this.router.navigate(['/homeEvents', { search: this.searchEventsStr }]);
    }
    
    clearEntries() {
        this.searchEntriesStr = '';
    }
    
    clearEvents() {
        this.searchEventsStr = '';
    }
}
