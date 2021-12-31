import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { EventEdition } from 'app/shared/model/event-edition.model';
import { EventSession } from 'app/shared/model/event-session.model';
import { IEventEntry } from 'app/shared/model/event-entry.model';
import { DriversNames } from 'app/shared/model/drivers-names.model';
import { DriversLaps } from 'app/shared/model/drivers-laps.model';
import { DriverLap } from 'app/shared/model/driver-lap.model';
import { DriverAverages } from 'app/shared/model/driver-averages.model';
import { LapPositions } from 'app/shared/model/lap-positions.model';
import { EventEditionService } from '../event-edition/event-edition.service';
import { EventSessionService } from '../event-session/event-session.service';

import { TimeMaskPipe } from 'app/shared/mask/time-mask.pipe';

import { MatTableDataSource, MatTabChangeEvent } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';

import { Options, ChangeContext } from '@angular-slider/ngx-slider';

import { faCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'jhi-race-data',
  templateUrl: './race-data.component.html',
  styleUrls: ['lapsAnalysis.scss'],
  providers: [TimeMaskPipe]
})
export class RaceDataComponent implements OnInit, AfterViewInit {
  @Input() eventEdition: EventEdition;
  @Input() session: EventSession;
  @Input() entries: IEventEntry[];
  lapTimes: DriversLaps[] = [];
  maxLaps = -1;
  lapNumbers: number[] = [];
  drivers: DriversNames[] = [];
  selectedDrivers: string[] = [];
  selectedDriversAvg: string[] = [];
  headers: string[] = [];
  averages: DriverAverages[] = [];
  driversAverages: DriverAverages[] = [];
  raceChart: LapPositions[];
  data: any;
  dataRaceChart: any;
  temp = Array;
  math = Math;
  options: any;
  optionsRaceChart: any;
  timeMask: TimeMaskPipe;
  lapsRangeFrom = 0;
  lapsRangeTo = 65;
  fastestTime: number;
  categoryToFilter: string;
  numberOfResults = 0;
  driversPerformance: any[];
  filteredDriversPerformance = [];

  gapsRaceChart: any;
  optionsGapsRaceChart: any;

  tyresRaceChart: any;
  optionsTyresRaceChart: any;

  raceGapsDataSource = new MatTableDataSource([]);
  raceGapsDisplayedColumns = ['driver', 'raceTime'];

  faCircle = faCircle;

  optionsSlider: Options = {
    floor: 0,
    ceil: 70,
    showTicks: true,
    tickStep: 5
  };

  lapByLapColumns = [];

  lapByLapDisplayedColumns = [];
  lapByLapDataSource = new MatTableDataSource([]);

  tyreCompounds = {
    hard: '',
    medium: '',
    soft: ''
  };

  constructor(
    private router: Router,
    private eventEditionService: EventEditionService,
    private eventSessionService: EventSessionService,
    private translateService: TranslateService
  ) {}

  getAccumulatedRaceTime(lapNumber) {
    const tmp = this.lapByLapDataSource.filteredData[0];
    return tmp[lapNumber].raceTime;
  }

  ngOnInit() {
    this.data = {
      labels: [],
      datasets: []
    };
    this.options = {
      // translateService: this.translateService,
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            if (!this.timeMask) {
              this.timeMask = new TimeMaskPipe();
            }
            return (
              data.datasets[tooltipItem.datasetIndex].label +
              ' ' +
              this.timeMask.transform(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] * 1000, true, false)
            );
          }
        }
      },
      scales: {
        xAxes: [
          {
            ticks: {
              min: 1,
              autoSkip: true,
              // eslint-disable-next-line
              callback(value, index, values) {
                return 'Lap ' + value;
                // return this.translateService.instant('motorsportsDatabaseApp.lapbylap.lap') + ' ' + value;
              }
            }
          }
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              min: 70,
              suggestedMax: 100,
              beginAtZero: true,
              // eslint-disable-next-line
              callback(value, index, values) {
                if (!this.timeMask) {
                  this.timeMask = new TimeMaskPipe();
                }
                return this.timeMask.transform(value * 1000, false, false);
              }
            }
          }
        ]
      },
      legend: {
        position: 'bottom'
      }
    };

    this.drivers = this.convertDriversNames();
    this.eventSessionService.findSessionAverages(this.session.id).subscribe(res => (this.averages = this.convertDriverAverages(res)));
    this.eventSessionService.findFastestTime(this.session.id).subscribe(res => {
      this.fastestTime = res;
      this.options.scales.yAxes[0].ticks.min = Math.floor((this.fastestTime - 10000) / 10000);
      this.redrawLapTimesChart();
    });
    this.eventSessionService.findMaxLaps(this.session.id).subscribe(res => {
      this.maxLaps = res;
      this.lapsRangeTo = this.maxLaps;
      const newOptionsSlider: any = Object.assign({}, this.optionsSlider);

      newOptionsSlider.translateService = this.translateService;
      newOptionsSlider.ceil = this.maxLaps;
      newOptionsSlider.translate = function(value: number) {
        if (value === 0) {
          return this.translateService.instant('motorsportsDatabaseApp.lapbylap.grid');
        }
        if (value === this.ceil) {
          return this.translateService.instant('motorsportsDatabaseApp.lapbylap.finish');
        }
        return this.translateService.instant('motorsportsDatabaseApp.lapbylap.lap') + ' ' + value;
      };
      this.optionsSlider = newOptionsSlider;
    });
    this.eventSessionService.findRaceChartData(this.session.id).subscribe(res => {
      this.raceChart = this.convertRaceChartData(res);
      this.raceGapsDataSource = new MatTableDataSource(this.raceChart[0].racePositions);
      const raceParticipants = this.raceChart[0].racePositions.length;

      for (let racePosition = 1; racePosition <= raceParticipants; racePosition++) {
        this.lapByLapColumns.push({
          columnDef: 'pos' + racePosition,
          header: 'Pos ' + racePosition,
          cell: (element: any) => element
        });
      }

      this.lapByLapDisplayedColumns = ['lap'];
      this.lapByLapColumns.map(c => c.columnDef).forEach(col => this.lapByLapDisplayedColumns.push(col));

      const lapByLapDataSourceTmp = [];
      const laps = this.raceChart.length;
      for (let i = 0; i < laps; i++) {
        const driverPositionLap = {};
        this.raceChart[i].racePositions.forEach(rp => {
          driverPositionLap['pos' + rp.position] = rp;
          driverPositionLap['pos' + rp.position].driverName = this.drivers
            .filter(driver => driver.raceNumber === rp.raceNumber)
            .map(driver =>
              driver.driversNames
                .substring(0, 3)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toUpperCase()
            );
        });
        lapByLapDataSourceTmp.push(driverPositionLap);
      }

      this.lapByLapDataSource = new MatTableDataSource(lapByLapDataSourceTmp);

      if (this.eventEdition.allowedCategories.filter(cat => cat.shortname === 'F1').length > 0) {
        const tyres = [
          ...new Set(
            this.raceChart.flatMap(lap =>
              lap.racePositions
                .map(racePosition => racePosition.tyreCompound.substring(0, 2))
                .filter(tyreCompound => tyreCompound.startsWith('C'))
            )
          )
        ];

        if (tyres.length > 0) {
          this.raceGapsDisplayedColumns.push('tyreCompound');
          tyres.sort();
          this.tyreCompounds.hard = tyres[0];
          this.tyreCompounds.medium = tyres[1];
          this.tyreCompounds.soft = tyres[2];
        }
      }

      const graphicLabels = this.raceChart.map(lapRaceChart =>
        lapRaceChart.lapNumber === 0
          ? this.translateService.instant('motorsportsDatabaseApp.lapbylap.grid')
          : this.translateService.instant('motorsportsDatabaseApp.lapbylap.lap') + ' ' + lapRaceChart.lapNumber
      );

      const data = {
        labels: graphicLabels,
        datasets: []
      };
      const gapsData = {
        labels: graphicLabels,
        datasets: []
      };
      const labels = this.raceChart[0].racePositions.map(pos => pos.raceNumber + ' ' + pos.driverName);
      this.optionsRaceChart = {
        tooltips: {
          callbacks: {
            label(tooltipItem, dataset) {
              const item = dataset.datasets[tooltipItem.datasetIndex];
              return '#' + item.label + ' - Pos ' + tooltipItem.value;
            }
          }
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                min: 1,
                reverse: true,
                stepSize: 1,
                // eslint-disable-next-line
                callback(value, index, values) {
                  return value - 1 > labels.length ? '' : '#' + labels[value - 1];
                }
              }
            }
          ]
        },
        legend: {
          position: 'bottom'
        }
      };

      this.optionsGapsRaceChart = {
        tooltips: {
          callbacks: {
            label(tooltipItem, dataset) {
              if (!this.timeMask) {
                this.timeMask = new TimeMaskPipe();
              }
              const timeGap = dataset.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              if (timeGap > 0) {
                return dataset.datasets[tooltipItem.datasetIndex].label + ' +' + this.timeMask.transform(timeGap, true, false);
              } else {
                return dataset.datasets[tooltipItem.datasetIndex].label;
              }
            }
          }
        },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                min: 0,
                beginAtZero: true,
                // eslint-disable-next-line
                callback(value, index, values) {
                  if (!this.timeMask) {
                    this.timeMask = new TimeMaskPipe();
                  }
                  return this.timeMask.transform(value, false, false);
                }
              }
            }
          ]
        },
        legend: {
          position: 'bottom'
        }
      };

      labels.forEach(label => {
        const randomColor = this.randomColor();
        const dataset = {
          label,
          data: this.raceChart
            .map(lapRaceChart => lapRaceChart.racePositions.filter(rp => rp.raceNumber + ' ' + rp.driverName === label))
            .map(l => {
              if (l[0] !== undefined) {
                return l[0].position;
              }
            }),
          fill: false,
          lineTension: 0,
          borderColor: randomColor,
          backgroundColor: randomColor
        };
        data.datasets.push(dataset);

        const gapsDataset = {
          label,
          data: this.raceChart.map(lapRaceChart => {
            const racePosition = lapRaceChart.racePositions.filter(rp => rp.raceNumber + ' ' + rp.driverName === label)[0];
            return racePosition !== undefined ? racePosition.accumulatedRaceTime - lapRaceChart.racePositions[0].accumulatedRaceTime : null;
          }),
          fill: false,
          lineTension: 0,
          borderColor: randomColor,
          backgroundColor: randomColor
        };
        gapsData.datasets.push(gapsDataset);
      });

      this.dataRaceChart = Object.assign({}, data);
      this.gapsRaceChart = Object.assign({}, gapsData);
    });
  }

  ngAfterViewInit() {
    // if (this.chart) this.chart.reflow();
  }

  //   saveChartInstance(chart: Highcharts.Chart) {
  //     this.chart = chart;
  //   }

  //   onChangeTab(event: MatTabChangeEvent) {
  //     if (event.index === 1) {
  //       this.chart.reflow();
  //     }
  //   }

  filterCategories(redraw = false) {
    this.filteredDriversPerformance = this.driversPerformance
      .filter(dp => dp.category === this.categoryToFilter)
      .sort((a, b) => (a.mean > b.mean ? 1 : 0))
      .slice(0, this.numberOfResults === 0 ? this.driversPerformance.length : this.numberOfResults);

    //     if (redraw) {
    //       this.chart.series[0].setData(this.filteredDriversPerformance.map(dp => [dp.min, dp.q1, dp.mean, dp.q3, dp.max]));
    //       this.chart.xAxis[0].setCategories(this.filteredDriversPerformance.map(dp => dp.driverName));
    //       this.chart.redraw();
    //     }
  }

  filterResults(redraw = false) {
    this.filteredDriversPerformance = this.driversPerformance
      .filter(dp => dp.category === this.categoryToFilter)
      .sort((a, b) => (a.mean > b.mean ? 1 : 0))
      .slice(0, this.numberOfResults === 0 ? this.driversPerformance.length : this.numberOfResults);

    //     if (redraw) {
    //       this.chart.series[0].setData(this.filteredDriversPerformance.map(dp => [dp.min, dp.q1, dp.mean, dp.q3, dp.max]));
    //       this.chart.xAxis[0].setCategories(this.filteredDriversPerformance.map(dp => dp.driverName));
    //       this.chart.redraw();
    //     }
  }

  showRacePositions(event) {
    this.raceGapsDataSource = new MatTableDataSource(this.raceChart[event.value].racePositions);
  }

  refreshLapTimesTable(raceNumber: string, event: any) {
    if (event.checked) {
      // Driver selected
      this.eventEditionService.loadLapTimes(this.session.id, raceNumber).subscribe(res => {
        this.lapTimes.push(this.convertLapTimes(res));
        const totalLaps = this.lapTimes.map(lt => lt.laps.length).reduce((p, c) => (p > c ? p : c));
        this.lapNumbers = Array.from(Array(totalLaps), (x, i) => i);
        this.headers.push(this.drivers.find(d => d.raceNumber === raceNumber).driversNames);
        this.selectedDrivers.push(raceNumber);
        this.redrawLapTimesChart();
      });
    } else {
      // Driver deselected
      const driverToRemove = this.lapTimes.find(d => d.raceNumber === raceNumber);
      this.lapTimes.splice(this.lapTimes.indexOf(driverToRemove), 1);
      this.selectedDrivers.splice(this.selectedDrivers.indexOf(this.selectedDrivers.find(d => d === raceNumber)), 1);
      const removedDriver = this.drivers.find(i => i.raceNumber === raceNumber);
      const pos = this.headers.indexOf(removedDriver.driversNames);
      this.headers.splice(pos, 1);
      const totalLaps = this.lapTimes.length > 0 ? this.lapTimes.map(lt => lt.laps.length).reduce((p, c) => (p > c ? p : c)) : 0;
      this.lapNumbers = this.headers.length > 0 ? Array.from(Array(totalLaps), (x, i) => i) : [];
      this.redrawLapTimesChart();
    }
  }

  private redrawLapTimesChart() {
    const data = {
      labels:
        this.lapNumbers && this.lapNumbers.length > 0 ? this.lapNumbers.slice(this.lapsRangeFrom, this.lapsRangeTo).map(ln => ln + 1) : [],
      datasets: []
    };
    let maxLapTime = 0;
    for (const driver of this.selectedDrivers) {
      const randomColor = this.randomColor();
      const driverLaps = this.lapTimes
        .find(lt => lt.raceNumber === driver)
        .laps.slice(this.lapsRangeFrom, this.lapsRangeTo)
        .map(l => l.lapTime / 1000);
      driverLaps.forEach(lap => {
        if (lap > maxLapTime) {
          maxLapTime = lap;
        }
      });
      const dataset = {
        label: this.drivers.find(d => d.raceNumber === driver).driversNames,
        data: driverLaps,
        fill: false,
        lineTension: 0,
        borderColor: randomColor,
        backgroundColor: randomColor
      };
      data.datasets.push(dataset);
    }
    this.options.scales.yAxes[0].ticks.suggestedMax = Math.floor((maxLapTime + 1000) / 1000);
    this.data = Object.assign({}, data);
    this.options = Object.assign({}, this.options);
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

  changeLapsRange(changeContext: ChangeContext) {
    this.lapsRangeFrom = changeContext.value;
    this.lapsRangeTo = changeContext.highValue;
    this.redrawLapTimesChart();
  }

  getFilteredDrivers() {
    return this.categoryToFilter ? this.drivers.filter(driver => driver.category === this.categoryToFilter) : this.drivers;
  }

  resetCategoryLapTimes() {
    this.lapTimes = [];
    this.headers = [];
    this.lapNumbers = [];
  }

  refreshAverages() {
    this.driversAverages = this.categoryToFilter ? this.averages.filter(avg => avg.category === this.categoryToFilter) : this.averages;
    this.getTopTen5BestLaps();
    this.getTopTen10BestLaps();
    this.getTopTen20BestLaps();
    this.getTopTen50BestLaps();
  }

  getTopTen5BestLaps() {
    const filtered = this.categoryToFilter ? this.averages.filter(avg => avg.category === this.categoryToFilter) : this.averages;
    return filtered
      .filter(avg => avg.best5Avg !== 0)
      .sort(function(a, b) {
        return a.best5Avg > b.best5Avg ? 1 : b.best5Avg > a.best5Avg ? -1 : 0;
      })
      .slice(0, 10);
  }

  getTopTen10BestLaps() {
    const filtered = this.categoryToFilter ? this.averages.filter(avg => avg.category === this.categoryToFilter) : this.averages;
    return filtered
      .filter(avg => avg.best10Avg !== 0)
      .sort(function(a, b) {
        return a.best10Avg > b.best10Avg ? 1 : b.best10Avg > a.best10Avg ? -1 : 0;
      })
      .slice(0, 10);
  }

  getTopTen20BestLaps() {
    const filtered = this.categoryToFilter ? this.averages.filter(avg => avg.category === this.categoryToFilter) : this.averages;
    return filtered
      .filter(avg => avg.best20Avg !== 0)
      .sort(function(a, b) {
        return a.best20Avg > b.best20Avg ? 1 : b.best20Avg > a.best20Avg ? -1 : 0;
      })
      .slice(0, 10);
  }

  getTopTen50BestLaps() {
    const filtered = this.categoryToFilter ? this.averages.filter(avg => avg.category === this.categoryToFilter) : this.averages;
    return filtered
      .filter(avg => avg.best50Avg !== 0)
      .sort(function(a, b) {
        return a.best50Avg > b.best50Avg ? 1 : b.best50Avg > a.best50Avg ? -1 : 0;
      })
      .slice(0, 10);
  }

  getDriverDataByDriverName(driverName: any) {
    const avg: DriverAverages[] = this.averages.filter(average => average.driverName === driverName.value.driverName);
    if (avg.length === 1) {
      return avg[0];
    }
    return [];
  }

  sortedDriversAverages() {
    return this.driversAverages.sort((a, b) => (parseInt(a.raceNumber, 10) > parseInt(b.raceNumber, 10) ? 1 : -1));
  }

  private convertDriversNames() {
    const result = [];
    this.entries.map(entry => {
      const driversNames = new DriversNames();
      driversNames.raceNumber = entry.raceNumber;
      driversNames.category = entry.category.shortname;
      driversNames.driversNames = entry.drivers.map(driverEntry => driverEntry.driver.surname).join(', ');
      result.push(driversNames);
    });
    return result;
  }

  private convertDriverAverages(json: any) {
    const result = [];
    for (let i = 0; i < json.length; i++) {
      result.push(Object.assign(new DriverAverages(), json[i]));
    }
    this.driversAverages = result.sort((da1, da2) => {
      const n1 = da1.driverName.substring(da1.driverName.indexOf(' '));
      const n2 = da2.driverName.substring(da2.driverName.indexOf(' '));
      return n1 > n2 ? 1 : -1;
    });
    return result;
  }

  private convertLapTimes(json: any): DriversLaps {
    const result = new DriversLaps();
    result.driverName = json[0].driverName;
    result.raceNumber = json[0].raceNumber;
    result.laps = [];
    for (let i = 0; i < json.length; i++) {
      result.laps.push(Object.assign(new DriverLap(), json[i]));
    }
    return result;
  }

  private convertRaceChartData(json: any) {
    const result = [];
    for (let i = 0; i < json.length; i++) result.push(Object.assign(new LapPositions(), json[i]));
    return result;
  }

  isChecked(raceNumber: string) {
    return this.selectedDrivers.some(d => d === raceNumber);
  }
}
