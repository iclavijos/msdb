import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils } from 'ng-jhipster';
import { EventManager, JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from '../../../helpers/mock-language.service';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { RacetrackDetailComponent } from '../../../../../../main/webapp/app/entities/racetrack/racetrack-detail.component';
import { RacetrackService } from '../../../../../../main/webapp/app/entities/racetrack/racetrack.service';
import { Racetrack } from '../../../../../../main/webapp/app/entities/racetrack/racetrack.model';
import { RacetrackLayoutService } from '../../../../../../main/webapp/app/entities/racetrack-layout/racetrack-layout.service';
import { RacetrackLayout } from '../../../../../../main/webapp/app/entities/racetrack-layout/racetrack-layout.model';

describe('Component Tests', () => {

    describe('Racetrack Management Detail Component', () => {
        let comp: RacetrackDetailComponent;
        let fixture: ComponentFixture<RacetrackDetailComponent>;
        let service: RacetrackService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [RacetrackDetailComponent],
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    {
                        provide: JhiLanguageService,
                        useClass: MockLanguageService
                    },
                    RacetrackService,
                    RacetrackLayoutService,
                    EventManager,
                    {
                        provide: Router,
                        useClass: class { navigate = jasmine.createSpy("navigate"); }
                    }
                ]
            }).overrideComponent(RacetrackDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RacetrackDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RacetrackService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Racetrack(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.racetrack).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
