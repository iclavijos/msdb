import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ResponseWrapper } from '../../shared';

import { DriversNames, DriversLaps, DriverLap, DriverAverages } from './';
import { EventEditionService } from '../event-edition';
import { EventSessionService } from '../event-session';

import { TimeMaskPipe } from '../../shared/mask/time-mask.pipe';

@Component({
    selector: 'jhi-race-data',
    templateUrl: './race-data.component.html',
    styleUrls: [
        'lapsAnalysis.css'
    ],
    providers: [TimeMaskPipe]
})
export class RaceDataComponent implements OnInit {

    @Input() sessionId: number;
    @Input() raceName: string;
    lapTimes: DriversLaps[] = [];
    maxLaps: number = -1;
    lapNumbers: number[];
    drivers: DriversNames[] = [];
    selectedDrivers: string[] = [];
    selectedDriversAvg: string[] = [];
    averages: DriverAverages[] = [];
    data: any;
    temp = Array;
    math = Math;
    options: any;
    timeMask: TimeMaskPipe;
    lapsRange: number[] = [2, 50];

    constructor(
        private http: Http,
        private router: Router,
        private eventEditionService: EventEditionService,
        private eventSessionService: EventSessionService) {
    }

    ngOnInit() {
        this.eventSessionService.findSessionDriverNames(this.sessionId).subscribe(
            (res: Response) => this.drivers = this.convertDriversNames(res.json));
        this.eventSessionService.findSessionAverages(this.sessionId).subscribe(
            (res: Response) => this.averages = this.convertDriverAverages(res.json)
        );
        this.data = {
            labels: [],
            datasets: [
            ]
        };
        this.options = {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        if (!this.timeMask) {
                            this.timeMask = new TimeMaskPipe();
                        }
                        return data.datasets[tooltipItem.datasetIndex].label + ' ' + 
                            this.timeMask.transform(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] * 10000, true, false);
                    }
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        min: 1,
                        max: 60,
                        autoSkip: false,
                        callback: function(value, index, values) {
                            return "Lap " + value;
                        }
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        min: 70,
                        suggestedMax: 100,
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            if (!this.timeMask) {
                                this.timeMask = new TimeMaskPipe();
                            }
                            return this.timeMask.transform(value * 10000, false, false);
                        }
                    }
                }]
            },
            legend: {
                position: 'bottom'
            }
        };
    }

    refreshLapTimesTable(raceNumber: string) {
        const pos: number = this.selectedDrivers.indexOf(raceNumber);
        if (pos != -1) {
            //Driver selected
            this.eventEditionService.loadLapTimes(this.sessionId, raceNumber).subscribe(
            	(res: Response) => {
                    this.lapTimes.push(this.convertLapTimes(res.json));
                    this.maxLaps = Math.max(this.maxLaps, res.json.length);
                    this.lapNumbers = Array.from(Array(this.maxLaps),(x,i)=>i);
                    //this.lapsRange = [2, this.maxLaps];
                    this.refreshGraphic();
                });
        } else {
            //Driver deselected
            const driverToRemove = this.lapTimes.find(d => d.raceNumber === raceNumber);
            const pos = this.lapTimes.indexOf(driverToRemove);
            this.lapTimes.splice(pos, 1);
            this.maxLaps = -1;
            for (let index = 0; index < this.lapTimes.length; index++) {
                this.maxLaps = Math.max(this.maxLaps, this.lapTimes[index].laps.length);
            }
            if (this.maxLaps === -1) {
                this.lapNumbers = undefined;
            } else {
                this.lapNumbers = Array.from(Array(this.maxLaps),(x,i)=>i);
            }
            this.refreshGraphic();
        }
        
    }

    private refreshGraphic() {
		let data = {
            labels: this.lapNumbers && this.lapNumbers.length > 0 ? 
                this.lapNumbers.slice(this.lapsRange[0] - 1, this.lapsRange[1]).map(ln => ln + 1) : [],
			datasets: []
		};
    	for(let driver of this.selectedDrivers) {    		
    		const randomColor = this.randomColor();
    		let dataset = {
	    		label: this.drivers.find(d => d.raceNumber === driver).driversNames,
				data: this.lapTimes.find(lt => lt.raceNumber === driver).laps.slice(this.lapsRange[0] - 1, this.lapsRange[1]).map(l => l.lapTime / 10000),
				fill: false,
				lineTension: 0,
				borderColor: randomColor,
                backgroundColor: randomColor,
    		}
    		data.datasets.push(dataset);
    	}
    	this.data = Object.assign({}, data);
    }

    randomColor(brightness = 3) {
    	// Six levels of brightness from 0 to 5, 0 being the darkest
        var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
        var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
        var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)})
        return "rgb(" + mixedrgb.join(",") + ")";
    }

    private convertDriversNames(json: any) {
        const result = [];
        for (let i = 0; i < json.length; i++) {
            result.push(Object.assign(new DriversNames(), json[i]));
        }
        return result;
    }

    private convertDriverAverages(json: any) {
        const result = [];
        for (let i = 0; i < json.length; i++) {
            result.push(Object.assign(new DriverAverages(), json[i]));
        }
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

    changeLapsRange(event) {
        this.lapsRange = event.values;
        this.refreshGraphic();
    }

    getTopTen5BestLaps() {
        return this.averages.sort(
            function(a,b) {
                return (a.best5Avg > b.best5Avg) ? 1 : ((b.best5Avg > a.best5Avg) ? -1 : 0);
            }
        ).slice(0,10);
    }

    getTopTen10BestLaps() {
        return this.averages.sort(
            function(a,b) {
                return (a.best10Avg > b.best10Avg) ? 1 : ((b.best10Avg > a.best10Avg) ? -1 : 0);
            }
        ).slice(0,10);
    }

    getTopTen20BestLaps() {
        return this.averages.sort(
            function(a,b) {
                return (a.best20Avg > b.best20Avg) ? 1 : ((b.best20Avg > a.best20Avg) ? -1 : 0);
            }
        ).slice(0,10);
    }

    getDriverDataByDriverName(driverName: string) {
        const avg: DriverAverages[] = this.averages.filter(avg => avg.driverName === driverName);
        if (avg.length === 1) {
            return avg[0];
        }
        return [];
    }
}