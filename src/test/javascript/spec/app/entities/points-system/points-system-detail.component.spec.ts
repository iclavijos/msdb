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
import { PointsSystemDetailComponent } from '../../../../../../main/webapp/app/entities/points-system/points-system-detail.component';
import { PointsSystemService } from '../../../../../../main/webapp/app/entities/points-system/points-system.service';
import { PointsSystem } from '../../../../../../main/webapp/app/entities/points-system/points-system.model';

describe('Component Tests', () => {

    describe('PointsSystem Management Detail Component', () => {
        let comp: PointsSystemDetailComponent;
        let fixture: ComponentFixture<PointsSystemDetailComponent>;
        let service: PointsSystemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [PointsSystemDetailComponent],
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
                    PointsSystemService
                ]
            }).overrideComponent(PointsSystemDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PointsSystemDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointsSystemService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new PointsSystem(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.pointsSystem).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
