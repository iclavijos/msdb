import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { EventEditionService } from 'app/entities/event-edition/event-edition.service';
import { SeriesEditionService } from 'app/entities/series-edition/series-edition.service';
import { SeriesEdition } from 'app/shared/model/series-edition.model';

@Component({
  selector: 'jhi-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['standings.scss']
})
export class StandingsComponent implements OnInit {
  drivers: any;
  teams: any;
  manufacturers: any;
  driversUnfiltered: any;
  teamsUnfiltered: any;
  manufacturersUnfiltered: any;
  headers: any;
  pointsByRace = [];
  resultsByRace = [];
  numRaces: number;
  @Input() eventEditionId: number;
  @Input() seriesEdition: SeriesEdition;
  @Input() seriesEditionIds: number[];
  @Input() seriesEditionNames: string[];
  showExtendedStandings = false;
  selectSeriesEditions = false;
  data: any;
  options: any;
  selectedDrivers: string[] = [];
  filterCategory: string;

  constructor(
    private eventEditionService: EventEditionService,
    private seriesEditionService: SeriesEditionService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.eventEditionId) {
      let seriesId = null;
      if (this.seriesEditionIds !== undefined) {
        seriesId = this.seriesEditionIds[0];
        this.selectSeriesEditions = this.seriesEditionIds.length > 1;
      }
      this.eventEditionService.loadDriversPoints(this.eventEditionId, seriesId).subscribe(driversPoints => {
        this.drivers = driversPoints;
      });
    } else if (this.seriesEdition) {
      this.showExtendedStandings = true;

      this.filterCategory = this.seriesEdition.allowedCategories[0].shortname;

      this.seriesEditionService.findDriversStandings(this.seriesEdition.id).subscribe(driversStandings => {
        this.driversUnfiltered = driversStandings;
        if (this.seriesEdition.standingsPerCategory) {
          this.drivers = this.driversUnfiltered.filter(d => d.category === this.filterCategory);
        } else {
          this.drivers = driversStandings;
        }
      });
      if (this.seriesEdition.teamsStandings) {
        this.seriesEditionService.findTeamsStandings(this.seriesEdition.id).subscribe(teamsStandings => {
          this.teamsUnfiltered = teamsStandings;
          if (this.seriesEdition.standingsPerCategory) {
            this.teams = this.teamsUnfiltered.filter(d => d.category === this.filterCategory);
          } else {
            this.teams = teamsStandings;
          }
        });
      }
      if (this.seriesEdition.manufacturersStandings) {
        this.seriesEditionService.findManufacturersStandings(this.seriesEdition.id).subscribe(manufacturersStandings => {
          this.manufacturersUnfiltered = manufacturersStandings;
          if (this.seriesEdition.standingsPerCategory) {
            this.manufacturers = this.manufacturersUnfiltered.filter(d => d.category === this.filterCategory);
          } else {
            this.manufacturers = manufacturersStandings;
          }
        });
      }

      this.updateDriversPoints();
      this.updateDriversResults();
    }
  }

  private updateDriversPoints() {
    this.seriesEditionService.findDriversPointsByRace(this.seriesEdition.id, this.filterCategory).subscribe(pointsByRace => {
      this.pointsByRace = pointsByRace;
      this.numRaces = pointsByRace[0].length - 2;
      this.data = {
        labels: pointsByRace[0].slice(1, this.numRaces + 1),
        datasets: []
      };
      this.options = {
        scales: {
          xAxes: [
            {
              ticks: {
                min: 15,
                max: 25,
                autoSkip: false
              }
            }
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                suggestedMax: 10,
                beginAtZero: true
              }
            }
          ]
        },
        legend: {
          position: 'bottom'
        }
      };
    });
  }

  private updateDriversResults() {
    this.seriesEditionService.findDriversResultsByRace(this.seriesEdition.id, this.filterCategory).subscribe(resultsByRace => {
      this.resultsByRace = resultsByRace;
    });
  }

  changeCategory() {
    this.drivers = this.driversUnfiltered.filter(d => d.category === this.filterCategory);
    if (this.teamsUnfiltered) {
      this.teams = this.teamsUnfiltered.filter(d => d.category === this.filterCategory);
    }
    if (this.manufacturersUnfiltered) {
      this.manufacturers = this.manufacturersUnfiltered.filter(d => d.category === this.filterCategory);
    }
    this.updateDriversResults();
    const data = {
      labels: this.pointsByRace[0].slice(1, this.numRaces + 1),
      datasets: []
    };
    this.data = Object.assign({}, data);
    this.selectedDrivers = [];
    this.updateDriversPoints();
  }

  refreshGraphic() {
    const data = {
      labels: this.pointsByRace[0].slice(1, this.numRaces + 1),
      datasets: []
    };
    for (const driver of this.selectedDrivers) {
      let accPoints = 0;
      let driverPoints: any;
      for (const points of this.pointsByRace) {
        if (points[0] === driver) {
          driverPoints = points;
        }
      }
      const pointsData = [];
      for (let i = 1; i < driverPoints.length - 1; i++) {
        accPoints += parseInt(driverPoints[i], 10);
        pointsData.push(accPoints);
      }
      const randomColor = this.randomColor();
      const dataset = {
        label: driver,
        data: pointsData,
        fill: false,
        lineTension: 0,
        borderColor: randomColor,
        backgroundColor: randomColor
      };
      data.datasets.push(dataset);
    }
    this.data = Object.assign({}, data);
  }

  randomColor(brightness = 3) {
    // Six levels of brightness from 0 to 5, 0 being the darkest
    const rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    const mix = [brightness * 51, brightness * 51, brightness * 51]; // 51 => 255/5
    const mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x) {
      return Math.round(x / 2.0);
    });
    return 'rgb(' + mixedrgb.join(',') + ')';
  }

  getPointsDetail(driverId: number) {
    if (this.eventEditionId !== undefined) {
      this.router.navigate([
        '/driver-points-details',
        {
          eventEditionId: this.eventEditionId,
          driverId,
          seriesEditionIds: this.seriesEditionIds
        }
      ]);
    } else {
      // Navigate to popup with points in series edition
      this.router.navigate([
        '/driver-points-series',
        {
          driverId,
          seriesEditionId: this.seriesEdition.id
        }
      ]);
    }
  }

  switchSeries(id) {
    if (!id) {
      return false;
    }
    this.eventEditionService.loadDriversPoints(this.eventEditionId, id).subscribe(driversPoints => {
      this.drivers = driversPoints;
    });
  }
}
