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
import { TyreProviderDetailComponent } from '../../../../../../main/webapp/app/entities/tyre-provider/tyre-provider-detail.component';
import { TyreProviderService } from '../../../../../../main/webapp/app/entities/tyre-provider/tyre-provider.service';
import { TyreProvider } from '../../../../../../main/webapp/app/entities/tyre-provider/tyre-provider.model';

describe('Component Tests', () => {

    describe('TyreProvider Management Detail Component', () => {
        let comp: TyreProviderDetailComponent;
        let fixture: ComponentFixture<TyreProviderDetailComponent>;
        let service: TyreProviderService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [TyreProviderDetailComponent],
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
                    TyreProviderService
                ]
            }).overrideComponent(TyreProviderDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TyreProviderDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TyreProviderService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new TyreProvider(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.tyreProvider).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
