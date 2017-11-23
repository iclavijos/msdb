import { Component, Input, OnInit } from '@angular/core';

import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DriverService } from '../../entities/driver';
import { TeamService } from '../../entities/team';
import { EngineService } from '../../entities/engine';
import { ChassisService } from '../../entities/chassis';

@Component({
    selector: 'jhi-statistics',
    templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnInit {

    @Input() id: number;
    @Input() statsType: string;
    stats: any[];
    yearsStats: number[];
    year: number;

    constructor(
        private router: Router,
        private driverService: DriverService,
        private teamService: TeamService,
        private chassisService: ChassisService,
        private engineService: EngineService,
        private http: Http
    ) {
    }

    ngOnInit() {
        this.loadStats(this.id);
        this.loadYears(this.id);
    }

    loadStats(id) {
        if (this.statsType === 'drivers') {
            this.driverService.getStats(id).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'teams') {
            this.teamService.getStats(id).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'chassis') {
            this.chassisService.getStats(id).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'engines') {
            this.engineService.getStats(id).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
    }
    loadStatsYear(id, year) {
        if (this.statsType === 'drivers') {
            this.driverService.getStatsYear(id, year).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'teams') {
            this.teamService.getStatsYear(id, year).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'chassis') {
            this.chassisService.getStatsYear(id, year).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'engines') {
            this.engineService.getStatsYear(id, year).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
    }
    loadYears(id) {
        if (this.statsType === 'drivers') {
            this.driverService.getYears(id).subscribe((stats) => {
               this.yearsStats = stats.json;
            });
        }
        if (this.statsType === 'teams') {
            this.teamService.getYears(id).subscribe((stats) => {
               this.yearsStats = stats.json;
            });
        }
        if (this.statsType === 'chassis') {
            this.chassisService.getYears(id).subscribe((stats) => {
               this.yearsStats = stats.json;
            });
        }
        if (this.statsType === 'engines') {
            this.engineService.getYears(id).subscribe((stats) => {
               this.yearsStats = stats.json;
            });
        }
    }

    finishingPosition(position: number): string {
        if (position === 900) {
            return 'DNF';
        }
        if (position === 901) {
            return 'DNS';
        }
        if (position === 902) {
            return 'DSQ';
        }
        if (position === 800) {
            return 'NC';
        }
        return '' + position;
    }

    jumpToYear(year) {
        if (!year) {
            this.loadStats(this.id);
            this.year = null;
        } else {
            this.year = year;
            this.loadStatsYear(this.id, year);
        }
    }

    getParticipations(category) {
        this.router.navigate(['/homeEntries', {
            statsType: this.statsType,
            id: this.id,
            category: category,
            concept: 'participations' }]);
    }

    getWins(category) {
        this.router.navigate(['/homeEntries', {
            statsType: this.statsType,
            id: this.id,
            category: category,
            concept: 'wins' }]);
    }
}
