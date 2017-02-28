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
import { CarDetailComponent } from '../../../../../../main/webapp/app/entities/car/car-detail.component';
import { CarService } from '../../../../../../main/webapp/app/entities/car/car.service';
import { Car } from '../../../../../../main/webapp/app/entities/car/car.model';

describe('Component Tests', () => {

    describe('Car Management Detail Component', () => {
        let comp: CarDetailComponent;
        let fixture: ComponentFixture<CarDetailComponent>;
        let service: CarService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [CarDetailComponent],
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
                    CarService
                ]
            }).overrideComponent(CarDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CarDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CarService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Car(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.car).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
