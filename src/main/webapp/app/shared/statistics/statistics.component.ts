import { Component, Input, OnInit } from '@angular/core';

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
    
    constructor (
        private driverService: DriverService,
        private teamService: TeamService,
        private chassisService: ChassisService,
        private engineService: EngineService
    ) {
        
    }
    
    ngOnInit() {
        this.loadStats(this.id);
        this.loadYears(this.id);
    }
    
    loadStats(id) {
        if (this.statsType === 'driver') {
            this.driverService.getStats(id).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'team') {
            this.teamService.getStats(id).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'chassis') {
            this.chassisService.getStats(id).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'engine') {
            this.engineService.getStats(id).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
    }
    loadStatsYear(id, year) {
        if (this.statsType === 'driver') {
            this.driverService.getStatsYear(id, year).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'team') {
            this.teamService.getStatsYear(id, year).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'chassis') {
            this.chassisService.getStatsYear(id, year).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
        if (this.statsType === 'engine') {
            this.engineService.getStatsYear(id, year).subscribe((stats) => {
               this.stats = stats.json;
            });
        }
    }
    loadYears(id) {
        if (this.statsType === 'driver') {
            this.driverService.getYears(id).subscribe((stats) => {
               this.yearsStats = stats.json;
            });
        }
        if (this.statsType === 'team') {
            this.teamService.getYears(id).subscribe((stats) => {
               this.yearsStats = stats.json;
            });
        }
        if (this.statsType === 'chassis') {
            this.chassisService.getYears(id).subscribe((stats) => {
               this.yearsStats = stats.json;
            });
        }
        if (this.statsType === 'engine') {
            this.engineService.getYears(id).subscribe((stats) => {
               this.yearsStats = stats.json;
            });
        }
    }
    
    finishingPosition(position: number): string {
        if (position === 900) return 'DNF';
        if (position === 901) return 'DNS';
        if (position === 902) return 'DSQ';
        return '' + position;
    }
    
    jumpToYear(year) {
        if (!year) this.loadStats(this.id);
        else this.loadStatsYear(this.id, year);
    }
}