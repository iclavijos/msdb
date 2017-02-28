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
import { ChassisDetailComponent } from '../../../../../../main/webapp/app/entities/chassis/chassis-detail.component';
import { ChassisService } from '../../../../../../main/webapp/app/entities/chassis/chassis.service';
import { Chassis } from '../../../../../../main/webapp/app/entities/chassis/chassis.model';

describe('Component Tests', () => {

    describe('Chassis Management Detail Component', () => {
        let comp: ChassisDetailComponent;
        let fixture: ComponentFixture<ChassisDetailComponent>;
        let service: ChassisService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [ChassisDetailComponent],
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
                    ChassisService
                ]
            }).overrideComponent(ChassisDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChassisDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChassisService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Chassis(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.chassis).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
