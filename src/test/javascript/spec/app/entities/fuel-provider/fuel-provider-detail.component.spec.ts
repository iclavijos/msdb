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
import { FuelProviderDetailComponent } from '../../../../../../main/webapp/app/entities/fuel-provider/fuel-provider-detail.component';
import { FuelProviderService } from '../../../../../../main/webapp/app/entities/fuel-provider/fuel-provider.service';
import { FuelProvider } from '../../../../../../main/webapp/app/entities/fuel-provider/fuel-provider.model';

describe('Component Tests', () => {

    describe('FuelProvider Management Detail Component', () => {
        let comp: FuelProviderDetailComponent;
        let fixture: ComponentFixture<FuelProviderDetailComponent>;
        let service: FuelProviderService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [FuelProviderDetailComponent],
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
                    FuelProviderService
                ]
            }).overrideComponent(FuelProviderDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FuelProviderDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FuelProviderService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new FuelProvider(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.fuelProvider).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
