import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';
import { ActivatedRoute, Router } from '@angular/router';

import { Http, Response } from '@angular/http';

import { Account, LoginModalService, Principal } from '../shared';

import { HomeData } from './home.model';

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

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private principal: Principal,
        private http: Http,
        private loginModalService: LoginModalService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
        this.jhiLanguageService.setLocations(['home']);
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.http.get('api/home').subscribe((res: Response) => {
            this.homeData = res.json();
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

    }
    
    clearEntries() {
        this.searchEntriesStr = '';
    }
    
    clearEvents() {
        this.searchEventsStr = '';
    }
}
