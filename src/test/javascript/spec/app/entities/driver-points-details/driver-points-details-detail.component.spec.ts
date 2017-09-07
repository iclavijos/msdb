/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { DriverPointsDetailsDetailComponent } from '../../../../../../main/webapp/app/entities/driver-points-details/driver-points-details-detail.component';
import { DriverPointsDetailsService } from '../../../../../../main/webapp/app/entities/driver-points-details/driver-points-details.service';
import { DriverPointsDetails } from '../../../../../../main/webapp/app/entities/driver-points-details/driver-points-details.model';

describe('Component Tests', () => {

    describe('DriverPointsDetails Management Detail Component', () => {
        let comp: DriverPointsDetailsDetailComponent;
        let fixture: ComponentFixture<DriverPointsDetailsDetailComponent>;
        let service: DriverPointsDetailsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule],
                declarations: [DriverPointsDetailsDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    DriverPointsDetailsService,
                    JhiEventManager
                ]
            }).overrideTemplate(DriverPointsDetailsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DriverPointsDetailsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DriverPointsDetailsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new DriverPointsDetails(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.driverPointsDetails).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
