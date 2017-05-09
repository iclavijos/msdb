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
import { EngineDetailComponent } from '../../../../../../main/webapp/app/entities/engine/engine-detail.component';
import { EngineService } from '../../../../../../main/webapp/app/entities/engine/engine.service';
import { Engine } from '../../../../../../main/webapp/app/entities/engine/engine.model';

describe('Component Tests', () => {

    describe('Engine Management Detail Component', () => {
        let comp: EngineDetailComponent;
        let fixture: ComponentFixture<EngineDetailComponent>;
        let service: EngineService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [EngineDetailComponent],
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
                    EngineService
                ]
            }).overrideComponent(EngineDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EngineDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EngineService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Engine(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.engine).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
