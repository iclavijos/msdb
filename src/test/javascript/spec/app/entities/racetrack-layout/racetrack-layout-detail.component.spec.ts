import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils } from 'ng-jhipster';
import { JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from '../../../helpers/mock-language.service';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { RacetrackLayoutDetailComponent } from '../../../../../../main/webapp/app/entities/racetrack-layout/racetrack-layout-detail.component';
import { RacetrackLayoutService } from '../../../../../../main/webapp/app/entities/racetrack-layout/racetrack-layout.service';
import { RacetrackLayout } from '../../../../../../main/webapp/app/entities/racetrack-layout/racetrack-layout.model';

describe('Component Tests', () => {

    describe('RacetrackLayout Management Detail Component', () => {
        let comp: RacetrackLayoutDetailComponent;
        let fixture: ComponentFixture<RacetrackLayoutDetailComponent>;
        let service: RacetrackLayoutService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [RacetrackLayoutDetailComponent],
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
                    RacetrackLayoutService
                ]
            }).overrideComponent(RacetrackLayoutDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RacetrackLayoutDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RacetrackLayoutService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new RacetrackLayout(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.racetrackLayout).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
