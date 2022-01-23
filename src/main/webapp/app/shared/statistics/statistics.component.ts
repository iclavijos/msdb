import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { DriverService } from 'app/entities/driver/service/driver.service';
import { TeamService } from 'app/entities/team/service/team.service';
import { EngineService } from 'app/entities/engine/service/engine.service';
// import { ChassisService } from 'app/entities/chassis/chassis.service';

@Component({
  selector: 'jhi-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnChanges {
  @Input() id!: number;
  @Input() statsType!: string;
  stats: any[] = [];
  yearsStats: any[] = [];
  year = 0;

  constructor(
    private router: Router,
    private driverService: DriverService,
    private teamService: TeamService,
    private engineService: EngineService,
    // private chassisService: ChassisService
  ) {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    this.id = changes['id'].currentValue;
    this.statsType = changes['statsType'].currentValue;
    this.loadStats(this.id);
    this.loadYears(this.id);
  }

  loadStats(id: number): void {
    if (this.statsType === 'drivers') {
      this.driverService.getStats(id).subscribe((stats: HttpResponse<any[]>) => {
        this.stats = stats.body as any[];
      });
    }
    if (this.statsType === 'teams') {
      this.teamService.getStats(id).subscribe((stats: HttpResponse<any[]>) => {
        this.stats = stats.body as any[];
      });
    }
    if (this.statsType === 'engines') {
      this.engineService.getStats(id).subscribe((stats: HttpResponse<any[]>) => {
        this.stats = stats.body as any[];
      });
    }
//     if (this.statsType === 'chassis') {
//       this.chassisService.getStats(id).subscribe((stats: HttpResponse<any[]>) => {
//         this.stats = stats.body as any[];
//       });
//     }
  }

  loadStatsYear(id: number, year: number): void {
    if (this.statsType === 'drivers') {
      this.driverService.getStatsYear(id, year).subscribe((stats: HttpResponse<any[]>) => {
        this.stats = stats.body as any[];
      });
    }
    if (this.statsType === 'teams') {
      this.teamService.getStatsYear(id, year).subscribe((stats: HttpResponse<any[]>) => {
        this.stats = stats.body as any[];
      });
    }
    if (this.statsType === 'engines') {
      this.engineService.getStatsYear(id, year).subscribe((stats: HttpResponse<any[]>) => {
        this.stats = stats.body as any[];
      });
    }
//     if (this.statsType === 'chassis') {
//       this.chassisService.getStatsYear(id, year).subscribe((stats: HttpResponse<any[]>) => {
//         this.stats = stats.body as any[];
//       });
//     }
  }

  loadYears(id: number): void {
    if (this.statsType === 'drivers') {
      this.driverService.getYears(id).subscribe((stats: HttpResponse<any[]>) => {
        this.yearsStats = stats.body as any[];
      });
    }
    if (this.statsType === 'teams') {
      this.teamService.getYears(id).subscribe((stats: HttpResponse<any[]>) => {
        this.yearsStats = stats.body as any[];
      });
    }
    if (this.statsType === 'engines') {
      this.engineService.getYears(id).subscribe((stats: HttpResponse<any[]>) => {
        this.yearsStats = stats.body as any[];
      });
    }
//     if (this.statsType === 'chassis') {
//       this.chassisService.getYears(id).subscribe((stats: HttpResponse<any[]>) => {
//         this.yearsStats = stats.body as any[];
//       });
//     }
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
    return `${position}`;
  }

  jumpToYear(event: Event): void {
    const year = (<HTMLInputElement>event.target).value;
    if (!year) {
      this.loadStats(this.id);
      this.year = null as any;
    } else {
      this.year = Number(year);
      this.loadStatsYear(this.id, this.year);
    }
  }

  getParticipations(category: string): void {
    this.router.navigate([
      '/homeEntries',
      {
        statsType: this.statsType,
        id: this.id,
        category,
        concept: 'participations'
      }
    ]);
  }

  getWins(category: string): void {
    this.router.navigate([
      '/homeEntries',
      {
        statsType: this.statsType,
        id: this.id,
        category,
        concept: 'wins'
      }
    ]);
  }
}
