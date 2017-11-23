/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
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
                imports: [MotorsportsDatabaseTestModule],
                declarations: [RacetrackLayoutDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    RacetrackLayoutService,
                    JhiEventManager
                ]
            }).overrideTemplate(RacetrackLayoutDetailComponent, '')
            .compileComponents();
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
            expect(comp.racetrackLayout).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
